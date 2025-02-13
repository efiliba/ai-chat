"use client";

import { useCallback } from "react";

import { useAI } from "@/hooks";
import { QuestionInput, UserQuestion, AIResponse } from "@/components";

//   // To kick off effect immediately, this plus CSS
//   document.scrollingElement.scroll(0, 1);
/* In case you need to kick off effect immediately, this plus JS */
/* height: 100.001vh; */

export default function Home() {
  const { ask, loading, error, reasoning, answer, history, abort } = useAI(
    "<think>",
    "</think>"
  );

  const handleLoadAIResponse = useCallback(ask, [ask, loading]);

  const handleCancelAIResponse = useCallback(abort, [abort]);

  return (
    <div className="[&_*]:[overflow-anchor:none] min-h-screen" id="scroller">
      <div className="max-w-4xl p-4 mx-auto space-y-4 border-white border-1">
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
      <div className="[overflow-anchor:auto!important] h-0.5" />
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
