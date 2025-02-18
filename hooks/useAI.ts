import { useReducer, useRef } from "react";

import { historyReducer, HistoryActionCreator } from "@/reducers";
import { streamToAsyncGenerator, createQueryString } from "@/utils";

// role: 'user' | 'assistant' | 'tool' | 'system';

export const useAI = (
  startReasoningMarker?: string,
  endReasoningMarker?: string
) => {
  const controller = useRef<AbortController>(null);

  const [state, dispatch] = useReducer(historyReducer, {
    loading: false,
    error: false,
    reasoning: "",
    answer: "",
    history: [],
  });

  const ask = async (question: string) => {
    controller.current = new AbortController();

    dispatch(HistoryActionCreator.addQuestion(question));
    dispatch(HistoryActionCreator.clearResponse());
    dispatch(HistoryActionCreator.setLoading(true));
    dispatch(HistoryActionCreator.setError(false));

    try {
      const response = await fetch(
        `/api/chat?${createQueryString({ question })}`,
        { signal: controller.current.signal }
      );

      const reader = response.body!.getReader();

      let error = false;
      let endReasoningMarkerDetected = false;
      for await (const value of streamToAsyncGenerator(reader)) {
        switch (true) {
          case endReasoningMarkerDetected:
            dispatch(HistoryActionCreator.buildAnswer(value));
            break;
          case value === endReasoningMarker:
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
        console.log("User aborted request");
      }
    }

    dispatch(HistoryActionCreator.setLoading(false));
  };

  return {
    ...state,
    ask,
    abort: () => controller.current?.abort(),
  };
};
