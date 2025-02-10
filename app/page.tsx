'use client';

import { useCallback } from 'react';

import { useAI } from '@/hooks';
import { QuestionInput, UserQuestion, AIResponse } from '@/components';

export default function Home() {
  const { ask, loading, reasoning, answer, history, abort } = useAI('<think>', '</think>');

  const handleLoadAIResponse = useCallback(ask, [loading]);

  const handleCancelAIResponse = useCallback(abort, []);

  return (
    <div className="h-screen grid content-between">
      <div className="p-4 container mx-auto max-w-4xl space-y-4 overflow-scroll">
        {history.map(({role, content}, index) =>
          role === 'user'
            ? <UserQuestion key={index} text={content} />
            : <AIResponse key={index} reasoning={content.reasoning} answer={content.answer} />
        )}
        <AIResponse reasoning={reasoning} answer={answer} />
      </div>
      <QuestionInput loading={loading} onSubmit={handleLoadAIResponse} onCancel={handleCancelAIResponse} />
    </div>
  );
}
