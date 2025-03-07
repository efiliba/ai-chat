import { type NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

import { chatHistoryAction } from "@/server";
import {
  streamToAsyncGenerator,
  iteratorToStream,
  joinReasoningAndAnswer,
} from "@/utils";

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

export async function POST(request: NextRequest) {
  const { id, question } = await request.json();

  const history = await chatHistoryAction(id);

  // console.log("createdChat", createdChat);
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
          content:
            "Keep your answer short, simple, straight forward, consise and avoid rambling, like I am doing here.",
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
