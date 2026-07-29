import { GoogleGenerativeAIEmbeddings }
from "@langchain/google-genai";

// embeddings model
export const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001"
});