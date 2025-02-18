import { useState } from "react";
import { Bot, Loader2, ArrowUpToLine, ArrowDownToLine } from "lucide-react";
import Markdown from "react-markdown";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui";

interface Props {
  reasoning: string;
  answer: string;
  hideReasoning?: boolean;
  onToggleReasoning?: () => void;
}
export const AIAnswer = ({
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
    <div className="max-w-[90%] rounded-lg p-4 bg-gray-800 text-gray-100">
      <Collapsible
        className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3"
        open={open}
        onOpenChange={handleOpen}
      >
        {answer ? (
          <Bot className="w-4 h-4" />
        ) : (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        <div className="text-sm font-medium">&rdquo;AI&rdquo;</div>
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
        <CollapsibleContent className="prose col-span-full max-w-none prose-invert prose-p:text-gray-100 prose-headings:text-gray-100 prose-strong:text-gray-100 prose-li:text-gray-100">
          <Markdown className="py-1 pl-2 mb-2 font-sans text-sm italic text-gray-300 border-l-2 border-gray-600">
            {reasoning}
          </Markdown>
        </CollapsibleContent>
      </Collapsible>
      <article className="prose max-w-none prose-invert prose-p:text-gray-100 prose-headings:text-gray-100 prose-strong:text-gray-100 prose-li:text-gray-100">
        <Markdown className="pt-0">{answer}</Markdown>
      </article>
    </div>
  );
};
