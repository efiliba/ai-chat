import { Role } from "@prisma/client";

import { Message } from "@/types";

export const splitReasoningAndAnswer = (content: string) => {
  const [, reasoning = "", answer = ""] = content.split(/<think>|<\/think>/);
  return { reasoning, answer };
};

export const joinReasoningAndAnswer = (messages: Message[]) =>
  messages.map(({ role, content }) => ({
    role,
    ...(role === Role.user
      ? { content }
      : { content: `<think>${content.reasoning}<\think>${content.answer}` }),
  })) as Message[];
