import { memo } from "react";
import { UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  error?: boolean;
  cancelled?: boolean;
  text: string;
}

export const UserQuestion = memo(({ error, cancelled, text }: Props) => (
  <div
    className={cn(
      "max-w-[90%] grid justify-self-end grid-cols-[auto_1fr] items-center gap-3 rounded-lg p-4 bg-primary text-primary-foreground",
      {
        "bg-red-700": error,
        "text-gray-100": error,
        "opacity-50": cancelled,
      }
    )}
  >
    <UserRound className="w-4 h-4" />
    <div className="text-sm font-medium">{`"You"${
      cancelled ? " - cancelled" : ""
    }`}</div>
    <article className={cn("col-span-full", { "font-serif": !error })}>
      {text}
    </article>
  </div>
));

UserQuestion.displayName = "UserQuestion";
