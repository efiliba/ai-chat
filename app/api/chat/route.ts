import { type NextRequest } from "next/server";

import { streamToAsyncGenerator, iteratorToStream } from "@/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

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
        { role: "user", content: searchParams.get("question") },
      ],
    }),
  });

  const reader = response.body!.getReader();
  const iterator = streamToAsyncGenerator(
    reader,
    (value) => JSON.parse(value).message.content
  );
  const stream = iteratorToStream(iterator);

  return new Response(stream);
}
