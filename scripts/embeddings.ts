import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "node:path";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { type Document } from "langchain/document";
import {
  OllamaEmbeddings,
  type OllamaEmbeddingsParams,
} from "@langchain/ollama";
import {
  PGVectorStore,
  type PGVectorStoreArgs,
} from "@langchain/community/vectorstores/pgvector";
import { type Pool as PoolType } from "pg";

import { createPool } from "../lib/postgres.ts";

const loadDocuments = async (documentsPath: string) => {
  const loader = new DirectoryLoader(path.join(process.cwd(), documentsPath), {
    // ".md": (filePath) => new TextLoader(filePath),
    // ".mdx": (filePath) => new TextLoader(filePath),
    ".pdf": (path) => new PDFLoader(path),
  });

  return await loader.load();
};

const SplitPDFDocuments = async (documents: Document[]) => {
  const pdfSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  return await pdfSplitter.splitDocuments(documents);
};

const SplitMarkdownDocuments = async (documents: Document[]) => {
  // for each document remove the frontmatter
  documents.forEach((document) => {
    document.pageContent = document.pageContent.replace(/---[\s\S]*?---/, "");
  });

  const markdownSplitter = new MarkdownTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  // to get an idea what the default separators are
  console.log(MarkdownTextSplitter.getSeparatorsForLanguage("markdown"));

  // custom markdown separators
  markdownSplitter.separators = [
    "\n## ", // h2 headers
    "\n### ", // h3 headers
    //'\n#{1,6}s', // h1-h6 headers
    "\n```", // code blocks
    "\n\n", // paragraphs
    "\n", // line breaks
  ];

  return await markdownSplitter.splitDocuments(documents);
};

const getEmbeddingModel = () => {
  const options: OllamaEmbeddingsParams = {
    // https://ollama.com/library/nomic-embed-text
    model: "nomic-embed-text:latest",
    //model: 'deepseek-r1:1.5b',
    baseUrl: "http://localhost:11434",
  };

  return new OllamaEmbeddings(options);
};

const processChunks = async (chunks: Document[]) => {
  const embeddingModel = getEmbeddingModel();
  const chunksContent = chunks.map((chunk) => chunk.pageContent);
  return await embeddingModel.embedDocuments(chunksContent);
};

const storeVectors = async (
  vectors: number[][],
  chunks: Document[],
  pgPool: PoolType
) => {
  const embeddings = getEmbeddingModel();
  const options: PGVectorStoreArgs = {
    pool: pgPool,
    tableName: "vectors",
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
    // note to self: supported distance strategies: cosine (default),
    // innerProduct, or euclidean
    distanceStrategy: "cosine",
  };

  const vectorStore = await PGVectorStore.initialize(embeddings, options);
  await vectorStore.addVectors(vectors, chunks);
  return vectorStore;
};

async function endVectorStorePool(vectorStore: PGVectorStore) {
  // closes all clients and then releases the pg pool
  await vectorStore.end();
}

const main = async () => {
  const pgPool = createPool();

  pgPool.on("error", (error) => {
    console.error("Unexpected error on idle client", error);
    process.exit(-1);
  });

  try {
    const documentsPath = "docs";
    const documents = await loadDocuments(documentsPath);
    console.log("documents loaded: ", documents.length);
    // const chunks = await SplitMarkdownDocuments(documents);
    const chunks = await SplitPDFDocuments(documents);
    console.log("chunks created: ", chunks.length);
    const embeddings = await processChunks(chunks);
    console.log("embeddings created: ", embeddings.length);
    const vectorStore = await storeVectors(embeddings, chunks, pgPool);
    console.log("vectors stored");
    await endVectorStorePool(vectorStore);
    console.log("postgres pool released");
  } catch (error) {
    console.error("Error: ", error);
  }
};

await main();
