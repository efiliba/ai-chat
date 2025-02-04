import { type NextRequest } from 'next/server';

import { streamAsyncIterator, iteratorToStream } from '@/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const question = searchParams.get('question');

  console.log('question', question);

  const response = await fetch('http://127.0.0.1:11434/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-r1',
      streaming: true,
      messages: [{
        role: 'user',
        content: question
      }]
    }),
  });

  const reader = response.body?.getReader();
  const iterator = streamAsyncIterator(reader!, value => JSON.parse(value).message.content);
  const stream = iteratorToStream(iterator);

  return new Response(stream);
}

// export async function GET() {
//   const iterator = makeIterator();
//   const stream = iteratorToStream(iterator);

//   return new Response(stream);
// }
