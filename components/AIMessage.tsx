import { memo, useState } from 'react';
import { Bot, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import Markdown from 'react-markdown';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui';

export const AIMessage = memo(({ text }: { text: string }) => {
  const [open, setOpen] = useState(true);
  
  const handleOpen = () => setOpen(toggle => !toggle);

  return (
    <Collapsible
      className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 max-w-[90%] rounded-lg p-4 bg-gray-800 text-gray-100"
      open={open}
      onOpenChange={handleOpen}
    >
      <Bot className="h-4 w-4" />
      <div className="text-sm font-medium">"AI"</div>
      <CollapsibleTrigger className="grid col-span-2 grid-cols-subgrid text-xs italic cursor-pointer">
        {open
          ? <>
              <div className="justify-self-end text-xs italic">Hide Reasoning</div>
              <ArrowUpToLine className="size-4" />
            </>
          : <>  
              <div className="justify-self-end text-xs italic">Show Reasoning</div>
              <ArrowDownToLine className="size-4" />
            </>
        }
      </CollapsibleTrigger>
      <CollapsibleContent className="col-span-full prose max-w-none prose-invert prose-p:text-gray-100 prose-headings:text-gray-100 prose-strong:text-gray-100 prose-li:text-gray-100">
        <Markdown>{text}</Markdown>
      </CollapsibleContent>
    </Collapsible>
  );
});
