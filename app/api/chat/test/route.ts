import { type NextRequest } from "next/server";
import { createOllama } from "ollama-ai-provider";
import { type CoreMessage, streamText, embed } from "ai";

import { createPool } from "@/lib/postgres";

// sets max streaming response time to 30 seconds
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  searchParams.get("id");

  return new Response(JSON.stringify("Hello, world!"));
}

interface ChatRequest {
  messages: {
    role: string;
    content: string;
  }[];
}

interface EmbeddingsRow {
  content: string;
  metadata: unknown;
  vector: number[];
}

const findKnowledge = async (question: string) => {
  const pgPool = createPool();

  pgPool.on("error", (error) => {
    console.error("Error connecting to Postgres:", error);
  });

  try {
    const embedding = await getEmbedding(question);

    const embeddingString = `[${embedding.map((e) => e.toFixed(6)).join(",")}]`;

    const query = `
      SELECT content, metadata, vector <=> $1 AS distance
      FROM vectors
      ORDER BY distance
      LIMIT 5
    `;

    const result = await pgPool.query<EmbeddingsRow>(query, [embeddingString]);

    console.log("Total results", result.rowCount);
    console.log("rows", result.rows);

    if (result.rows.length > 0) {
      const knowledge = result.rows.map(({ content, metadata }) => ({
        content,
        metadata,
      }));

      // Eli: metadata dropped ??? after extracted
      return knowledge.map(({ content }) => content).join(" ");
    }

    return null;
  } catch (error) {
    let message = "Error while finding knowledge";
    const errorString =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Unknown error";
    message += errorString !== "" ? ` (${errorString})` : "";
    throw new Error(message);
  } finally {
    await pgPool.end();
  }
};

const getEmbedding = async (question: string): Promise<number[]> => {
  const ollamaProvider = createOllama({
    baseURL: "http://localhost:11434/api",
  });

  // const embeddingModel = ollamaProvider.embedding("nomic-embed-text:latest");
  const embeddingModel = ollamaProvider.embedding("deepseek-r1:1.5b");

  try {
    const result = await embed({
      model: embeddingModel,
      value: question,
    });

    return result.embedding;
  } catch (error) {
    console.error("Error getting embeddings:", error);
    throw new Error("Error getting embeddings");
  }
};

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequest;
  const messages = body.messages as CoreMessage[];

  console.log("messages", messages.length);

  // debugger;
  // console.log("body", body);
  // console.log("messages", messages);
  // console.log("parts", messages[0].parts);
  // console.log("<--------------------------------------------->");

  const ollamaProvider = createOllama({
    baseURL: "http://localhost:11434/api",
  });

  const ollamaModel = ollamaProvider("deepseek-r1:1.5b");

  const lastMessage = messages[messages.length - 1].content;

  let knowledge = null;
  try {
    if (typeof lastMessage !== "string") {
      throw new Error("Message content must be a string");
    }
    knowledge = await findKnowledge(lastMessage);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "unknown error";
    return new Response(errorMessage, { status: 500 });
  }

  let prompt = `You are a helpful AI chat bot.
                You should answer the following question: "${lastMessage}"\n\n`;

  if (typeof knowledge === "string" && knowledge !== "") {
    prompt += `When answering you should use the following knowledge:
    ${knowledge}\n\n`;
  }

  prompt += 'End every response with the sentence "Happy coding!"';

  const result = streamText({
    model: ollamaModel,
    prompt: prompt,
    temperature: 0.1,
  });

  const response = result.toDataStreamResponse({
    getErrorMessage: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Unknown error";
      console.error(message);
      return message;
    },
  });

  console.log("2: ------>", response);

  return response;
}
