"use client";

import { useCallback } from "react";

import { useAI } from "@/hooks";
import { QuestionInput, UserQuestion, AIResponse } from "@/components";

export default function Home() {
  const { ask, loading, error, reasoning, answer, history, abort } = useAI(
    "<think>",
    "</think>"
  );

  const handleLoadAIResponse = useCallback(ask, [ask, loading]);

  const handleCancelAIResponse = useCallback(abort, [abort]);

  return (
    <div className="grid grid-rows-[1fr_auto] h-screen">
      <div className="container flex flex-col-reverse max-w-4xl p-4 mx-auto overflow-y-auto">
        <div className="space-y-4 basis-full">
          {history.map(({ role, content }, index) =>
            role === "user" ? (
              <UserQuestion key={index} text={content} />
            ) : (
              <AIResponse
                key={index}
                reasoning={content.reasoning}
                answer={content.answer}
              />
            )
          )}
          <AIResponse
            error={error}
            loading={loading}
            reasoning={reasoning}
            answer={answer}
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
