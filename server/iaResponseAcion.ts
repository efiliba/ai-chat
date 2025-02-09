'use server';

import { streamAsyncIterator } from '@/utils';

export async function aiResponseAcion() {
  const result = await fetch('http://127.0.0.1:11434/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-r1',
      // streaming: true,
      messages: [{
        role: 'user',
        content: 'Hello'
      }]
    })
  });

  let assistantResponse = '';
  const reader = result.body?.getReader();
  for await (const value of streamAsyncIterator(reader!)) {
    const { message: { content } } = JSON.parse(value);
    assistantResponse += content;
  }

  return assistantResponse;
}
