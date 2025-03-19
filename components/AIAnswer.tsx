"use client";

import { useState } from "react";
import { Bot, Loader2, ArrowUpToLine, ArrowDownToLine } from "lucide-react";
import Markdown from "react-markdown";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui";

interface Props {
  cancelled?: boolean;
  reasoning: string;
  answer: string;
  hideReasoning?: boolean;
  onToggleReasoning?: () => void;
}

export const AIAnswer = ({
  cancelled,
  reasoning,
  answer,
  hideReasoning = false,
  onToggleReasoning = () => {},
}: Props) => {
  const [open, setOpen] = useState(!hideReasoning);

  const handleOpen = () => {
    setOpen((toggle) => !toggle);
    onToggleReasoning();
  };

  return (
    <div
      className={cn(
        "max-w-[90%] rounded-lg p-4 bg-secondary border-t-1 shadow-sm shadow-primary text-secondary-foreground",
        { "opacity-50": cancelled }
      )}
    >
      <Collapsible
        className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3"
        open={open}
        onOpenChange={handleOpen}
      >
        {answer || cancelled ? (
          <Bot className="w-4 h-4" />
        ) : (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        <div className="text-sm font-medium">{`"AI"${
          cancelled ? " - cancelled" : ""
        }`}</div>
        <CollapsibleTrigger className="grid col-span-2 text-xs italic cursor-pointer grid-cols-subgrid">
          {open ? (
            <>
              <div className="text-xs italic justify-self-end">
                Hide Reasoning
              </div>
              <ArrowUpToLine className="size-4" />
            </>
          ) : (
            <>
              <div className="text-xs italic justify-self-end">
                Show Reasoning
              </div>
              <ArrowDownToLine className="size-4" />
            </>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="prose dark:prose-invert col-span-full text-current">
          <Markdown className="py-1 pl-2 mb-2 font-sans text-sm italic border-l border-primary/25">
            {reasoning}
          </Markdown>
        </CollapsibleContent>
      </Collapsible>
      <article className="prose dark:prose-invert text-current">
        <Markdown className="pt-0">{answer}</Markdown>
      </article>
    </div>
  );
};
