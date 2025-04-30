/**
 * This script is used to index the dataset into Typesense.
 * 
 * If FORCE_REINDEX is set to true, the script will delete the existing collection and create a new one.
 * 
 * If FORCE_REINDEX is set to false, the script will check if the collection exists and cancel the operation if it does.
 * 
 * Currently, we are not doing embedded indexing. The next step will be to embed some of the columns to create a RAG functionality.
 * 
 * 
  // OLD COLLECTION
  // await typesense.collections().create({
  //   name: COLLECTION_NAME,
  //   fields: [
  //     { name: 'title', type: 'string' },
  //     { name: 'description', type: 'string' },
  //     // { name: 'metadata_tags', type: 'string[]'},
  //     { name: 'state', type: 'string', facet: true },
  //     // { name: 'bill_number', type: 'string', facet: true },
  //     // { name: 'start_date', type: 'string', facet: true},
  //     // { name: 'latest_update', type: 'string' },
  //     // { name: 'sponsors', type: 'string[]', facet: true },
  //     // { name: 'state_link', type: 'string' },
  //     { name: 'url', type: 'string' },
  //   ],
  // });
 */

import Typesense from 'typesense';
import 'dotenv/config';
import * as fs from 'fs';
import * as readline from 'readline';

// Establish the collection name and path to the dataset
const COLLECTION_NAME = 'edutestRAG';
const CONVERSATION_COLLECTION_NAME = 'eduRAG-conversation-store';
const PATH_TO_DATASET = './scripts/data/eduTest.jsonl';

const typesense = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST ?? 'localhost',
      port: Number(process.env.TYPESENSE_PORT ?? 8108),
      protocol: process.env.TYPESENSE_PROTOCOL ?? 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_ADMIN_API_KEY ?? '',
  // 15 minutes
  connectionTimeoutSeconds: 15 * 60,
  // logLevel: 'debug',
});

async function createDataCollection(dataCollectionName: string) {
  console.log('Creating data collection')

  // Create new collection
  await typesense.collections().create({
    name: dataCollectionName,
    fields: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'state', type: 'string'},
      { 
        name: 'url',
        type: 'string' 
      },
      { name: 'embedding',
        type: 'float[]',
        embed: {
          from: ['title', 'description', 'state'],
          model_config: {
            model_name: "openai/text-embedding-3-small",
            api_key: process.env.OPENAI_API_KEY
          },
        },
      },
    ],
  });

  // Read and parse the JSONL file line by line
  try {
    const documents: any[] = [];
    const fileStream = fs.createReadStream(PATH_TO_DATASET);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      if (line.trim()) {
        try {
          const document = JSON.parse(line);
          documents.push(document);
        } catch (err) {
          console.error(`Error parsing line: ${line}`, err);
        }
      }
    }

    console.log(`Successfully parsed ${documents.length} documents`);
    
    // Import the parsed documents
    if (documents.length > 0) {
      const results = await typesense.collections(dataCollectionName).documents().import(documents);
      console.log(results);
    } else {
      console.error('No documents to import');
    }
  } catch (err) {
    console.error('Error reading or importing data:', err);
  }
}

async function createConversationHistoryCollection(conversationStoreCollectionName: string) {
  console.log('Creating conversation history collection')

  let conversationStoreSchema = {
    name: conversationStoreCollectionName,
    fields: [
      {
        name: "conversation_id",
        type: <const> "string",
      },
      {
        name: "model_id",
        type: <const> "string",
      },
      {
        name: "role",
        type: <const> "string",
        index: false
      },
      {
        name: "message",
        type: <const> "string",
        index: false
      },
      {
        name: "timestamp",
        type: <const> "int32"
      }
    ]
  }
  const results = await typesense.collections().create(conversationStoreSchema);
  console.log(results);
}

async function indexInTypesense() {
  let results;

  // Create the collection that will store the data we want to ask questions on
  let dataCollectionName = COLLECTION_NAME;
  const dataCollectionExists = await typesense.collections(dataCollectionName).exists();
  if (dataCollectionExists && process.env.FORCE_REINDEX === 'true') {
    console.log(`Collection ${dataCollectionName} already exists, so deleting it`)
    await typesense.collections(dataCollectionName).delete();
    await createDataCollection(dataCollectionName);
  } else if (!dataCollectionExists) {
    await createDataCollection(dataCollectionName);
  }

  // Create a collection that will store conversation history for follow-up questions
  let conversationHistoryCollectionName = CONVERSATION_COLLECTION_NAME
  const conversationHistoryCollectionExists = await typesense.collections(conversationHistoryCollectionName).exists();
  if (conversationHistoryCollectionExists && process.env.FORCE_REINDEX === 'true') {
    console.log('Deleting existing conversation history collection')
    await typesense.collections(conversationHistoryCollectionName).delete();
    await createConversationHistoryCollection(conversationHistoryCollectionName);
  } else if (!conversationHistoryCollectionExists) {
    await createConversationHistoryCollection(conversationHistoryCollectionName);
  }

  // Create the LLM-powered conversation model resource
  const conversationModelName = 'gpt-4o-mini'

  try {
    results = await typesense.conversations().models(conversationModelName).retrieve()
    console.log('Conversation model already exists, so deleting it')
    results = await typesense.conversations().models(conversationModelName).delete()
  } catch (e) {
    if(e instanceof Typesense.Errors.ObjectNotFound) {
      console.log("Conversation model not found, so creating it...")
    } else {
      console.error(e);
      throw e;
    }
  } finally {
    console.log('Creating conversation model')
    const modelCreateParameters = {
      id: conversationModelName,
      system_prompt:
          "You are an assistant for question-answering like a government information analyst and specialist. You can only make conversations based on the provided context. If a response cannot be formed strictly using the context, politely say you don't have knowledge about that topic. Do not answer questions that are not strictly on the topic of the government related documents found in the store.",
      history_collection: conversationHistoryCollectionName,

      model_name: 'openai/gpt-4o-mini',
      max_bytes: 16384,
      api_key: process.env.OPENAI_API_KEY
    }
    results = await typesense.conversations().models().create(modelCreateParameters);
  }
  console.log(results);
}

indexInTypesense();