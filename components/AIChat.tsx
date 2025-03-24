"use client";

import { useRef, useState, useCallback } from "react";
import { redirect } from "next/navigation";
import { useChat } from "@ai-sdk/react";

import { Message } from "@/types";
import { useEffectWhenToggledOn, useAI } from "@/hooks";
import { QuestionInput } from "@/components/QuestionInput";
import { AIResponse } from "@/components/AIResponse";
import { ChatHistory } from "@/components/ChatHistory";

export const AIChat = ({
  id,
  initialHistory,
}: {
  id: string;
  initialHistory: Message[];
}) => {
  const scrollAnchorRef = useRef<HTMLInputElement>(null);

  const [hideReasoning, setHideReasoning] = useState(false);

  const {
    ask,
    loading,
    error,
    chatStarted,
    reasoning,
    answer,
    history,
    abort,
  } = useAI(id, initialHistory, "<think>", "</think>");

  // Move into useAI
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onError: (error) => {
      console.error("useChat onError: ", error);
    },
  });

  useEffectWhenToggledOn(() => {
    if (!error) {
      redirect("/");
    }
  }, chatStarted);

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
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((message) => (
        <div
          key={message.id}
          className="whitespace-pre-wrap"
          style={{ color: message.role === "user" ? "yellow" : "green" }}
        >
          <strong>{`${message.role}: `}</strong>
          <br />
          {message.content}
          <br />
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );

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
};
