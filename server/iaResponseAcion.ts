"use server";

import { streamToAsyncGenerator } from "@/utils";

export async function aiResponseAcion() {
  const result = await fetch("http://127.0.0.1:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-r1",
      // streaming: true,
      messages: [
        {
          role: "user",
          content: "Hello",
        },
      ],
    }),
  });

  let aiResponse = "";
  const reader = result.body!.getReader();
  for await (const value of streamToAsyncGenerator(reader)) {
    const {
      message: { content },
    } = JSON.parse(value);
    aiResponse += content;
  }

  return aiResponse;
}
