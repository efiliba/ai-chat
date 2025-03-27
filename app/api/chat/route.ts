import { type NextRequest } from "next/server";
import { createOllama } from "ollama-ai-provider";
import { embed } from "ai";
import { PrismaClient } from "@prisma/client";

import { createPool } from "@/lib/postgres";
import { chatHistoryAction } from "@/server";
import {
  streamToAsyncGenerator,
  iteratorToStream,
  joinReasoningAndAnswer,
} from "@/utils";

// sets max streaming response time to 30 seconds
export const maxDuration = 30;

type EmbeddingsRow = {
  content: string;
  metadata: unknown;
  vector: number[];
};

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  searchParams.get("id");

  return new Response(JSON.stringify("Hello, world!"));
}

const save = async ({
  id,
  question,
  answer,
}: {
  id: string;
  question: string;
  answer: string;
}) => {
  await prisma.chatMessage.createMany({
    data: [
      {
        chatId: id,
        role: "user",
        content: question,
      },
      {
        chatId: id,
        role: "assistant",
        content: answer,
      },
    ],
  });
};

const getEmbedding = async (question: string): Promise<number[]> => {
  const ollamaProvider = createOllama({
    baseURL: "http://localhost:11434/api",
  });

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

export async function POST(request: NextRequest) {
  const { id, question } = await request.json();

  const [history, knowledge] = await Promise.all([
    chatHistoryAction(id),
    findKnowledge(question),
  ]);

  const knowledgePrompt = `You are an employment agent answering questions about your client.
    Answer truthfuly but show them in the best light possable so that they will be hired.
    Use the following information: ${knowledge}
  `;

  // https://54.206.225.110:11434/api/chat
  const response = await fetch("http://127.0.0.1:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-r1",
      streaming: true,
      messages: [
        {
          role: "system",
          content: knowledgePrompt,
        },
        ...joinReasoningAndAnswer(history),
        { role: "user", content: question },
      ],
    }),
  });

  const reader = response.body!.getReader();
  const iterator = streamToAsyncGenerator(
    reader,
    (value) => JSON.parse(value).message.content,
    (answer) => save({ id, question, answer })
  );

  const stream = iteratorToStream(iterator);

  return new Response(stream);
}
