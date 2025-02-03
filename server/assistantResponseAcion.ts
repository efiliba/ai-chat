"use server";

// import { Dispatch, SetStateAction } from "react";

function streamAsyncIterator(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const decoder = new TextDecoder("utf-8");

  return {
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) return;
          yield decoder.decode(value);
        }
      } finally {
        reader.releaseLock();
      }
    }
  };
}

export async function assistantResponseAcion() {
  // export async function assistantResponseAcion(setMessages: Dispatch<SetStateAction<string>>) {

  const result = await fetch("http://127.0.0.1:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-r1",
      streaming: true,
      messages: [{
        role: "user",
        content: "Hello"
      }]
    })
  });

  let assistantResponse = "";
  const reader = result.body?.getReader();
  for await (const value of streamAsyncIterator(reader!)) {
    const { message: { content } } = JSON.parse(value);
    assistantResponse += content;
    // setMessages(assistantResponse);
    console.log(content);
  }

  return assistantResponse;
}
