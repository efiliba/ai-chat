import { useState, useRef } from 'react';

import { streamAsyncIterator, createQueryString } from '@/utils';

type Message = {
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
};

export const useAI = () => {
  const controller = useRef<AbortController>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<Message[]>([]);

  const ask = async (question: string) => {
    controller.current = new AbortController();

    setHistory(chat => chat
      .concat(response ? [{ role: 'assistant', content: response }] : []) // Previous AI response, if any
      .concat({ role: 'user', content: question }));

    setLoading(true);
    setResponse('');

    try {
      const response = await fetch(`/api/chat?${createQueryString({ question })}`, { signal: controller.current.signal });
      const reader = response.body?.getReader();

      for await (const value of streamAsyncIterator(reader!)) {
        setResponse(m => m + value);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('User aborted request');
      }
    }

    setLoading(false);
  };

  return {
    ask,
    loading,
    history,
    response,
    abort: () => controller.current?.abort()
  };
};
