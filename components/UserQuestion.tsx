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
      "max-w-[90%] grid justify-self-end grid-cols-[auto_1fr] items-center gap-3 rounded-lg p-4 bg-primary",
      {
        "bg-red-700": error,
        "text-secondary": !error,
        "text-gray-100": error,
        "opacity-50": cancelled,
      }
    )}
  >
    <UserRound className="w-4 h-4" />
    <div className="text-sm font-medium">{`"You"${
      cancelled ? " - cancelled" : ""
    }`}</div>
    <article className={classNames("col-span-full", { "font-serif": !error })}>
      {text}
    </article>
  </div>
));

UserQuestion.displayName = "UserQuestion";
