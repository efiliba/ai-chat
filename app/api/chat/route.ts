import { type NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

import { streamToAsyncGenerator, iteratorToStream } from "@/utils";

const prisma = new PrismaClient();

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

  const createdChat = await prisma.chat.upsert({
    where: { id },
    create: { id },
    update: {},
  });

  // console.log("createdChat", createdChat);

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
