"use client";

import { useMemo, useEffect, useReducer, useRef } from "react";

import { historyReducer, HistoryActionCreator } from "@/reducers";
import { streamToAsyncGenerator } from "@/utils";
import { Message } from "@/types";

// role: 'user' | 'assistant' | 'tool' | 'system';

export const useAI = (
  id: string,
  initialHistory: Message[] = [],
  startReasoningMarker: string,
  endReasoningMarker: string
) => {
  const [state, dispatch] = useReducer(historyReducer, {
    loading: false,
    error: false,
    chatStarted: initialHistory.length > 0,
    reasoning: "",
    answer: "",
    history: initialHistory,
  });

  useEffect(() => {
    dispatch(HistoryActionCreator.setHistory(initialHistory));
    dispatch(HistoryActionCreator.chatStarted(initialHistory.length > 0));
  }, [initialHistory]);

  const controller = useRef<AbortController>(null);

  const endReasoningMarkerRegex = useMemo(
    () => new RegExp(endReasoningMarker),
    [endReasoningMarker]
  );

  const ask = async (question: string) => {
    controller.current = new AbortController();

    dispatch(HistoryActionCreator.addQuestion(question));
    dispatch(HistoryActionCreator.clearResponse());
    dispatch(HistoryActionCreator.setLoading(true));
    dispatch(HistoryActionCreator.setError(false));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          question,
        }),
        signal: controller.current.signal,
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      const reader = response.body!.getReader();

      let error = false;
      let endReasoningMarkerDetected = false;
      for await (const value of streamToAsyncGenerator(reader)) {
        switch (true) {
          case endReasoningMarkerDetected:
            dispatch(HistoryActionCreator.buildAnswer(value));
            break;
          case endReasoningMarkerRegex.test(value):
            endReasoningMarkerDetected = true;
            break;
          case value === "_*_error_*_":
            error = true;
            break;
          case value !== startReasoningMarker:
            dispatch(HistoryActionCreator.buildReasoning(value));
            break;
        }
      }

      if (error) {
        dispatch(HistoryActionCreator.setError(true));
        dispatch(HistoryActionCreator.setLastQuestionErrored());
      } else {
        dispatch(HistoryActionCreator.moveResponse());
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        dispatch(HistoryActionCreator.setLastQuestionCancelled());
        dispatch(HistoryActionCreator.moveCancelledResponse());
      } else {
        dispatch(HistoryActionCreator.setError(true));
        dispatch(HistoryActionCreator.buildReasoning(String(e)));
        dispatch(HistoryActionCreator.setLastQuestionErrored());
      }
    }

    dispatch(HistoryActionCreator.setLoading(false));

    if (state.history.length === 0) {
      dispatch(HistoryActionCreator.chatStarted(true));
    }
  };

  return {
    ...state,
    ask,
    abort: () => controller.current?.abort(),
  };
};
