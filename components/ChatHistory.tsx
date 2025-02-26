import { type Message } from "@/types";
import { UserQuestion } from "@/components/UserQuestion";
import { AIResponse } from "@/components/AIResponse";

interface Props {
  history: Message[];
  hideReasoning: boolean;
}

export const ChatHistory = ({ history, hideReasoning }: Props) =>
  history.map(({ error, cancelled, role, content }, index) =>
    role === "user" ? (
      <UserQuestion
        key={index}
        error={error}
        cancelled={cancelled}
        text={content}
      />
    ) : (
      <AIResponse
        key={index}
        error={error}
        cancelled={cancelled}
        reasoning={content.reasoning}
        answer={content.answer}
        hideReasoning={hideReasoning}
      />
    )
  );
