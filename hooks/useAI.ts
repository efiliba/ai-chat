import { useState, useRef } from "react";

import { streamToAsyncGenerator, createQueryString } from "@/utils";

// role: 'user' | 'assistant' | 'tool' | 'system';

type UserMessage = {
  role: "user";
  content: string;
};

type AssistantMessage = {
  role: "assistant";
  content: {
    reasoning: string;
    answer: string;
  };
};

type Message = UserMessage | AssistantMessage;

export const useAI = (
  startReasoningMarker?: string,
  endReasoningMarker?: string
) => {
  const controller = useRef<AbortController>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reasoning, setReasoning] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<Message[]>([]);

  const ask = async (question: string) => {
    controller.current = new AbortController();

    setHistory((chat) =>
      chat
        .concat(
          error ? [] : [{ role: "assistant", content: { reasoning, answer } }] // Previous AI response
        )
        .concat({ role: "user", content: question })
    );

    setLoading(true);
    setError(false);
    setReasoning("");
    setAnswer("");

    try {
      const response = await fetch(
        `/api/chat?${createQueryString({ question })}`,
        { signal: controller.current.signal }
      );
      const reader = response.body!.getReader();

      let endReasoningMarkerDetected = false;
      for await (const value of streamToAsyncGenerator(reader)) {
        if (endReasoningMarkerDetected) {
          setAnswer((message) => message + value);
        } else if (value === endReasoningMarker) {
          endReasoningMarkerDetected = true;
        } else if (value === "_*_error_*_") {
          setError(true);
        } else if (value !== startReasoningMarker) {
          setReasoning((message) => message + value);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("User aborted request");
      }
    }

    setLoading(false);
  };

  return {
    ask,
    loading,
    error,
    reasoning,
    answer,
    history,
    abort: () => controller.current?.abort(),
  };
};
