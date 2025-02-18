import { type Message } from "@/types";

const ActionType = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_LAST_QUESTION_ERRORED: "SET_LAST_QUESTION_ERRORED",
  SET_LAST_QUESTION_CANCELLED: "SET_LAST_QUESTION_CANCELLED",
  ADD_QUESTION: "ADD_QUESTION",
  MOVE_RESPONSE: "MOVE_RESPONSE",
  MOVE_CANCELLED_RESPONSE: "MOVE_CANCELLED_RESPONSE",
  CLEAR_RESPONSE: "CLEAR_RESPONSE",
  BUILD_REASONING: "BUILD_REASONING",
  BUILD_ANSWER: "BUILD_ANSWER",
} as const;

// export type ActionCreator = {
//   SetLoading: {
//     type: typeof ActionType.SET_LOADING;
//     payload: boolean;
//   };
//   SetError: {
//     type: typeof ActionType.SET_ERROR;
//     payload: boolean;
//   };
//   AddQuestion: {
//     type: typeof ActionType.ADD_QUESTION;
//     payload: string;
//   };
//   BuildReasoning: {
//     type: typeof ActionType.BUILD_REASONING;
//     payload: string;
//   };
//   BuildAnswer: {
//     type: typeof ActionType.BUILD_ANSWER;
//     payload: string;
//   };
//   MoveResponse: {
//     type: typeof ActionType.MOVE_RESPONSE;
//   };
// };

export const HistoryActionCreator = {
  setLoading: (payload: boolean) => ({
    type: ActionType.SET_LOADING,
    payload,
  }),
  setError: (payload: boolean) => ({
    type: ActionType.SET_ERROR,
    payload,
  }),
  setLastQuestionErrored: () => ({
    type: ActionType.SET_LAST_QUESTION_ERRORED,
  }),
  setLastQuestionCancelled: () => ({
    type: ActionType.SET_LAST_QUESTION_CANCELLED,
  }),
  addQuestion: (payload: string) => ({
    type: ActionType.ADD_QUESTION,
    payload,
  }),
  moveResponse: () => ({
    type: ActionType.MOVE_RESPONSE,
  }),
  moveCancelledResponse: () => ({
    type: ActionType.MOVE_CANCELLED_RESPONSE,
  }),
  clearResponse: () => ({ type: ActionType.CLEAR_RESPONSE }),
  buildReasoning: (payload: string) => ({
    type: ActionType.BUILD_REASONING,
    payload,
  }),
  buildAnswer: (payload: string) => ({
    type: ActionType.BUILD_ANSWER,
    payload,
  }),
};

type State = {
  loading: boolean;
  error: boolean;
  history: Message[];
  reasoning: string;
  answer: string;
};

type Action =
  | {
      type: typeof ActionType.SET_LOADING;
      payload: boolean;
    }
  | {
      type: typeof ActionType.SET_ERROR;
      payload: boolean;
    }
  | {
      type: typeof ActionType.SET_LAST_QUESTION_ERRORED;
    }
  | {
      type: typeof ActionType.SET_LAST_QUESTION_CANCELLED;
    }
  | {
      type: typeof ActionType.ADD_QUESTION;
      payload: string;
    }
  | {
      type: typeof ActionType.MOVE_RESPONSE;
    }
  | {
      type: typeof ActionType.MOVE_CANCELLED_RESPONSE;
    }
  | {
      type: typeof ActionType.CLEAR_RESPONSE;
    }
  | {
      type: typeof ActionType.BUILD_REASONING;
      payload: string;
    }
  | {
      type: typeof ActionType.BUILD_ANSWER;
      payload: string;
    };

export const historyReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case ActionType.SET_LAST_QUESTION_ERRORED: {
      const history = [...state.history];
      const lastQuestion = history.pop() || { role: "user", content: "" };
      return {
        ...state,
        history: history.concat({
          ...lastQuestion,
          error: true,
        }),
      };
    }
    case ActionType.SET_LAST_QUESTION_CANCELLED: {
      const history = [...state.history];
      const lastQuestion = history.pop() || { role: "user", content: "" };
      return {
        ...state,
        history: history.concat({
          ...lastQuestion,
          cancelled: true,
        }),
      };
    }
    case ActionType.ADD_QUESTION:
      return {
        ...state,
        history: state.history.concat({
          role: "user",
          content: action.payload,
        }),
      };
    case ActionType.MOVE_RESPONSE:
      return {
        ...state,
        history: state.history.concat({
          role: "assistant",
          content: {
            reasoning: state.reasoning,
            answer: state.answer,
          },
        }),
        reasoning: "",
        answer: "",
      };
    case ActionType.MOVE_CANCELLED_RESPONSE:
      return {
        ...state,
        ...(state.reasoning.length > 0 && {
          history: state.history.concat({
            role: "assistant",
            content: {
              reasoning: state.reasoning,
              answer: state.answer,
            },
            cancelled: true,
          }),
        }),
        reasoning: "",
        answer: "",
      };
    case ActionType.CLEAR_RESPONSE:
      return {
        ...state,
        reasoning: "",
        answer: "",
      };
    case ActionType.BUILD_REASONING:
      return {
        ...state,
        reasoning: state.reasoning + action.payload,
      };
    case ActionType.BUILD_ANSWER:
      return {
        ...state,
        answer: state.answer + action.payload,
      };
    default:
      return state;
  }
};
