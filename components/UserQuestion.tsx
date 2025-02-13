import { memo } from "react";
import { UserRound } from "lucide-react";

export const UserQuestion = memo(({ text }: { text: string }) => (
  <div className="grid justify-self-end grid-cols-[auto_1fr] items-center gap-3 max-w-[90%] rounded-lg p-4 bg-primary text-black">
    <UserRound className="w-4 h-4" />
    <span className="text-sm font-medium">&rdquo;You&rdquo;</span>
    <article className="font-serif col-span-full">{text}</article>
  </div>
));

UserQuestion.displayName = "UserQuestion";
