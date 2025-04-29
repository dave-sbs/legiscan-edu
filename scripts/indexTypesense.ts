/**
 * This script is used to index the dataset into Typesense.
 * 
 * If FORCE_REINDEX is set to true, the script will delete the existing collection and create a new one.
 * 
 * If FORCE_REINDEX is set to false, the script will check if the collection exists and cancel the operation if it does.
 * 
 * Currently, we are not doing embedded indexing. The next step will be to embed some of the columns to create a RAG functionality.
 * 
 */

import Typesense from 'typesense';
import 'dotenv/config';
import fs from 'fs/promises';
import { resolve } from 'path';

// Establish the collection name and path to the dataset
const COLLECTION_NAME = 'edutest';
const PATH_TO_DATASET = './scripts/data/eduTest.jsonl';

(async () => {
  console.log('Connecting to typesense server...');

  const typesense = new Typesense.Client({
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY || 'xyz',
    nodes: [
      {
        url: process.env.NEXT_PUBLIC_TYPESENSE_URL || 'http://localhost:8108',
      },
    ],
    connectionTimeoutSeconds: 60 * 60,
  });

  // Check if collection exists
  try {
    await typesense.collections(COLLECTION_NAME).retrieve();
    console.log(`Found existing collection of ${COLLECTION_NAME}`);

    if (process.env.FORCE_REINDEX !== 'true')
      return console.log('FORCE_REINDEX = false. Canceling operation...');

    // If FORCE_REINDEX is true, delete the existing collection
    console.log('Deleting collection');
    await typesense.collections(COLLECTION_NAME).delete();
  } catch (err) {
    console.error(err);
  }

  console.log('Creating schema...');

  // Create new collection
  await typesense.collections().create({
    name: COLLECTION_NAME,
    fields: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'metadata_tags', type: 'string[]'},
      { name: 'state', type: 'string', facet: true },
      { name: 'bill_number', type: 'string', facet: true },
      { name: 'start_date', type: 'string', facet: true},
      { name: 'latest_update', type: 'string' },
      { name: 'sponsors', type: 'string[]', facet: true },
      { name: 'state_link', type: 'string' },
      { name: 'url', type: 'string' },
    ],
  });

  console.log('Indexing data');

  const dataset = await fs.readFile(
    resolve(resolve(), PATH_TO_DATASET),
    'utf-8'
  );

  try {
    const returnData = await typesense
      .collections(COLLECTION_NAME)
      .documents()
      .import(dataset);

    console.log('Return data: ', returnData);
  } catch (error) {
    console.log(error);
  }
})();
