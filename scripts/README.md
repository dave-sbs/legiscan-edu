**indexTypesense.ts**
This script is used to index the dataset into Typesense.

If FORCE_REINDEX is set to true, the script will delete the existing collection and create a new one.

If FORCE_REINDEX is set to false, the script will check if the collection exists and cancel the operation if it does.

Currently, we are not doing embedded indexing. The next step will be to embed some of the columns to create a RAG functionality.


**updateCollectionMetadata.ts**
This script is used to update the collection metadata.

I am currently not doing it correctly.
