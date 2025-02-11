'use client';

import { useCallback } from 'react';

import { useAI } from '@/hooks';
import { QuestionInput, UserQuestion, AIResponse } from '@/components';

export default function Home() {
  const { ask, loading, reasoning, answer, history, abort } = useAI('<think>', '</think>');

  const handleLoadAIResponse = useCallback(ask, [loading]);

  const handleCancelAIResponse = useCallback(abort, []);

    // <div class="window">
  //   <div class="autoscroll">
  //   </div>
  // </div>

  // .window {
  //   height: 300px;
  // }
  
  // .autoscroll {
  //   border: solid 1px;
  //   display: flex;
  //   flex-direction: column-reverse;
  //   height: calc(100% - 56px);
  //   overflow-y: auto;
  // }
  // <div className="flex flex-col-reverse overflow-y-auto h-[calc(100%-56px)]">

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
