"use client";

import { useRef, useState, useCallback } from "react";

import { useAI } from "@/hooks";
import { QuestionInput } from "@/components/QuestionInput";
import { AIResponse } from "@/components/AIResponse";
import { ChatHistory } from "@/components/ChatHistory";

export default function Home() {
  const scrollAnchorRef = useRef<HTMLInputElement>(null);

  const [hideReasoning, setHideReasoning] = useState(false);

  const { ask, loading, error, reasoning, answer, history, abort } = useAI(
    "1",
    "<think>",
    "</think>"
  );

  const handleLoadAIResponse = useCallback(
    (question: string) => {
      scrollAnchorRef.current?.scrollIntoView();
      ask(question);
    },
    [ask]
  );

  const handleCancelAIResponse = useCallback(abort, [abort]);

  const handleToggleReasoning = () => {
    setHideReasoning((toggle) => !toggle);
  };

  return (
    <div className="[&_*:not(.scroll-anchor)]:[overflow-anchor:none] min-h-screen grid grid-rows-[1fr_auto_auto]">
      <div className="container max-w-4xl p-4 mx-auto space-y-4">
        <ChatHistory history={history} hideReasoning={hideReasoning} />
        <AIResponse
          error={error}
          loading={loading}
          reasoning={reasoning}
          answer={answer}
          hideReasoning={hideReasoning}
          onToggleReasoning={handleToggleReasoning}
        />
      </div>
      <div ref={scrollAnchorRef} className="scroll-anchor h-[1px]" />
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
