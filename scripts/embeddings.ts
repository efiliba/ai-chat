import path from "node:path";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { type Document } from "langchain/document";
import { OllamaEmbeddings } from "@langchain/ollama";
import {
  PGVectorStore,
  type PGVectorStoreArgs,
} from "@langchain/community/vectorstores/pgvector";

import { createPool, type PoolType } from "../lib/postgres.ts";

const loadDocuments = (documentsPath: string) => {
  const loader = new DirectoryLoader(path.join(process.cwd(), documentsPath), {
    // ".md": (filePath) => new TextLoader(filePath),
    // ".mdx": (filePath) => new TextLoader(filePath),
    ".pdf": (filePath) => new PDFLoader(filePath),
  });

  return loader.load();
};

const splitPDFDocuments = (documents: Document[]) => {
  const pdfSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  return pdfSplitter.splitDocuments(documents);
};

const splitMarkdownDocuments = (documents: Document[]) => {
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

  return markdownSplitter.splitDocuments(documents);
};

const generateEmbeddings = (
  embeddingModel: OllamaEmbeddings,
  chunks: Document[]
) => {
  const chunksContent = chunks.map(({ pageContent }) => pageContent);
  return embeddingModel.embedDocuments(chunksContent);
};

const initializeVectorStore = (
  pgPool: PoolType,
  embeddingModel: OllamaEmbeddings
) => {
  const options: PGVectorStoreArgs = {
    pool: pgPool,
    tableName: "vectors",
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
    distanceStrategy: "cosine",
  };

  return PGVectorStore.initialize(embeddingModel, options);
};

const generateDocumentEmbeddings = async (
  documentsPath: string,
  embeddingModel: OllamaEmbeddings
) => {
  const documents = await loadDocuments(documentsPath);
  console.log("documents loaded: ", documents.length);

  // const chunks = await splitMarkdownDocuments(documents);
  const chunks = await splitPDFDocuments(documents);
  console.log("chunks created: ", chunks.length);

  return {
    embeddings: await generateEmbeddings(embeddingModel, chunks),
    chunks,
  };
};

const main = async () => {
  const documentsPath = "docs";

  try {
    const embeddingModel = new OllamaEmbeddings({
      baseUrl: "http://localhost:11434",
      model: "deepseek-r1:1.5b",
    });

    const pgPool = createPool();
    pgPool.on("error", (error) => {
      console.error("Unexpected error on idle client", error);
      process.exit(-1);
    });

    const [vectorStore, { embeddings, chunks }] = await Promise.all([
      initializeVectorStore(pgPool, embeddingModel),
      generateDocumentEmbeddings(documentsPath, embeddingModel),
    ]);
    console.log("vector store and embeddings created: ", embeddings.length);

    await vectorStore.addVectors(embeddings, chunks);
    await vectorStore.end();
    console.log("vectors added to postgreSQL store");
  } catch (error) {
    console.error("Error: ", error);
  }
};

await main();
