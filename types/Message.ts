type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type UserQuestion = {
  role: "user";
  content: string;
};

type AIAnswerContent = {
  reasoning: string;
  answer: string;
};

type AIAnswer = {
  role: "assistant";
  content: AIAnswerContent;
};

export type Message = Prettify<(UserQuestion | AIAnswer) & { error?: boolean }>;
