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
    <div className="[&_*:not(.scroll-anchor)]:[overflow-anchor:none] min-h-screen grid grid-rows-[1fr_auto_auto]">
      <div className="container max-w-4xl p-4 mx-auto space-y-4">
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
      <div className="scroll-anchor h-[1px]" />
      <QuestionInput
        className="sticky bottom-0"
        loading={loading}
        focus={!loading}
        onSubmit={handleLoadAIResponse}
        onCancel={handleCancelAIResponse}
      />
    </div>
  );
}
