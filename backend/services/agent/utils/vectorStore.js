import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embedding.js";

// creating the vectorDB using qdrant vector store and langchain

export const createVectorStore = async(collectionName,docs)=>{
    return await QdrantVectorStore.fromDocuments(
        docs,
        embeddings,
        {
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
            collectionName
        }
    );
};