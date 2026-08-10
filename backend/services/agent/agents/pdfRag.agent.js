// for creating a RAG (Retrieval-Augmented Generation) agent
//  that can process PDF files and 
// answer questions based on the content of the uploaded PDF.

import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createVectorStore } from "../utils/vectorStore.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../utils/model.js";
import { QdrantVectorStore } from "@langchain/qdrant";

export const pdfRagAgent = async (state) => {
  try {
    // get the buffer of the file/pdf uploaded by the user
    const buffer = fs.readFileSync(state.file.path);

    // parse the PDF file to extract text content
    const pdf = new PDFParse({ data: buffer });

    // extract the text content from the PDF
    const result = await pdf.getText();
    const text = result.text;

    // ** create chunks of text from the extracted text using RecursiveCharacterTextSplitter from langchain
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200 // to avoid losing context between chunks
    });

    // create documents of the chunks 
    const docs = await splitter.createDocuments([text]);
    const collectionName = `pdf-${Date.now()}`;

    // ** store the documents in a vector store (Qdrant) for similarity search
    const vectorStore = await createVectorStore(collectionName, docs);




    // perform similarity search on the vector store to find relevant documents based on the user's prompt
    const relevantDocs = await vectorStore.similaritySearch(
      state.prompt,
      5 // retrieve top 5 relevant documents
    );

    // console.log(relevantDocs);

    // create a context string from the relevant documents to provide to the LLM
    const context = relevantDocs
      .map(doc => doc.pageContent)
      .join("\n\n");

    const llm = getModel("pdf-rag");

    const messages = [
      new SystemMessage(`

You are orbit PDF Assistant.

Rules:

- Answer ONLY from the uploaded PDF.

- Never make up information.

- If the answer is not present in the PDF, reply:

"I couldn't find this information in the uploaded PDF."

- Use Markdown formatting.

`),

      new HumanMessage(`
Context:

${context}

Question:

${state.prompt}

`)
    ];

    // invoke the llm with the context and the user's prompt to generate a response
    const response = await llm.invoke(messages);


    return {
      ...state,
      docs,
      response: response.content
    };

  }
  finally { // cleanup: delete the uploaded PDF file and the vector store collection after processing

    try {
      fs.unlinkSync(
        state.file.path
      );
      await QdrantVectorStore.deleteCollection(
        collectionName
      );
    }
    catch (err) {
      console.error("PDF RAG cleanup error:", err.message || err);
    }

  }
};