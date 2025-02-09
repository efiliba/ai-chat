'use client';

import { useCallback } from 'react';

import { useAI } from '@/hooks';
import { Question, UserMessage, AIMessage } from '@/components';

export default function Home() {
  const { ask, loading, history, response, abort } = useAI();

  const handleLoadAIResponse = useCallback(ask, [loading]);

  const handleCancelAIResponse = useCallback(abort, []);

  return (
    <div className="h-screen grid content-between">
      <div className="p-4 container mx-auto max-w-4xl space-y-4 overflow-scroll">
        {history.map(({role, content}, index) =>
          role === 'user'
            ? <UserMessage key={index} text={content} />
            : <AIMessage key={index} text={content} />
        )}
        {response.length > 0 && <AIMessage text={response} />}
      </div>
      <Question loading={loading} onSubmit={handleLoadAIResponse} onCancel={handleCancelAIResponse} />
    </div>
  );
}
