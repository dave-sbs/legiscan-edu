import Typesense from 'typesense';
import 'dotenv/config';
import fs from 'fs/promises';
import { resolve } from 'path';

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

  try {
    await typesense.collections(COLLECTION_NAME).retrieve();
    console.log(`Found existing collection of ${COLLECTION_NAME}`);

    if (process.env.FORCE_REINDEX !== 'true')
      return console.log('FORCE_REINDEX = false. Canceling operation...');

    console.log('Deleting collection');
    await typesense.collections(COLLECTION_NAME).delete();
  } catch (err) {
    console.error(err);
  }

  console.log('Creating schema...');

  await typesense.collections().create({
    name: COLLECTION_NAME,
    fields: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'metadata_tags', type: 'string[]', facet: true },
      { name: 'state', type: 'string', facet: true },
      { name: 'bill_number', type: 'string', facet: true },
      { name: 'start_date', type: 'string' },
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
