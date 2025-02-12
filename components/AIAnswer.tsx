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
}
export const AIAnswer = ({ reasoning, answer }: Props) => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => setOpen((toggle) => !toggle);

  return (
    <div className="max-w-[90%] rounded-lg p-4 bg-gray-800 text-gray-100">
      <Collapsible
        className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3"
        open={open}
        onOpenChange={handleOpen}
      >
        {answer ? (
          <Bot className="h-4 w-4" />
        ) : (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        <div className="text-sm font-medium">&rdquo;AI&rdquo;</div>
        <CollapsibleTrigger className="grid col-span-2 grid-cols-subgrid text-xs italic cursor-pointer">
          {open ? (
            <>
              <div className="justify-self-end text-xs italic">
                Hide Reasoning
              </div>
              <ArrowUpToLine className="size-4" />
            </>
          ) : (
            <>
              <div className="justify-self-end text-xs italic">
                Show Reasoning
              </div>
              <ArrowDownToLine className="size-4" />
            </>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="col-span-full prose max-w-none prose-invert prose-p:text-gray-100 prose-headings:text-gray-100 prose-strong:text-gray-100 prose-li:text-gray-100">
          <Markdown className="font-sans mb-2 text-sm italic border-l-2 border-gray-600 pl-2 py-1 text-gray-300">
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
