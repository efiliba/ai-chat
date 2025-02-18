"use client";

import { useCallback, useState } from "react";

import { useAI } from "@/hooks";
import { QuestionInput, UserQuestion, AIResponse } from "@/components";

export default function Home() {
  const [hideReasoning, setHideReasoning] = useState(false);

  const { ask, loading, error, reasoning, answer, history, abort } = useAI(
    "<think>",
    "</think>"
  );

  const handleLoadAIResponse = useCallback(ask, [ask, loading]);

  const handleCancelAIResponse = useCallback(abort, [abort]);

  const handleToggleReasoning = () => {
    setHideReasoning((toggle) => !toggle);
  };

  return (
    <div className="grid grid-rows-[1fr_auto] h-screen">
      <div className="container flex flex-col-reverse max-w-4xl p-4 mx-auto overflow-y-auto">
        <div className="space-y-4 basis-full">
          {history.map(({ error, cancelled, role, content }, index) =>
            role === "user" ? (
              <UserQuestion
                key={index}
                error={error}
                cancelled={cancelled}
                text={content}
              />
            ) : (
              <AIResponse
                key={index}
                error={error}
                cancelled={cancelled}
                reasoning={content.reasoning}
                answer={content.answer}
                hideReasoning={hideReasoning}
              />
            )
          )}
          <AIResponse
            error={error}
            loading={loading}
            reasoning={reasoning}
            answer={answer}
            hideReasoning={hideReasoning}
            onToggleReasoning={handleToggleReasoning}
          />
        </div>
      </div>
      <QuestionInput
        loading={loading}
        focus={!loading}
        onSubmit={handleLoadAIResponse}
        onCancel={handleCancelAIResponse}
      />
    </div>
  );
}
