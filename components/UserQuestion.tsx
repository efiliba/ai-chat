import { memo } from "react";
import { UserRound } from "lucide-react";
import classNames from "classnames";

interface Props {
  error?: boolean;
  cancelled?: boolean;
  text: string;
}

export const UserQuestion = memo(({ error, cancelled, text }: Props) => (
  <div
    className={classNames(
      "grid justify-self-end grid-cols-[auto_1fr] items-center gap-3 max-w-[90%] rounded-lg p-4 bg-primary text-black",
      { "bg-red-500": error },
      { "opacity-25": cancelled }
    )}
  >
    <UserRound className="w-4 h-4" />
    <div className="text-sm font-medium">{`"You"${
      cancelled ? " - cancelled" : ""
    }`}</div>
    <article className="font-serif col-span-full selection:bg-amber-200 selection:text-amber-950">
      {text}
    </article>
  </div>
));

UserQuestion.displayName = "UserQuestion";
