import { memo, useState } from 'react';
import { Bot, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import Markdown from 'react-markdown';

export const AIMessage = memo(({ text }: { text: string }) => {
  const [collapsed, setCollapsed] = useState(true);
  
  const handleCollapse = () => setCollapsed(collapse => !collapse);

  return (
    <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 max-w-[90%] rounded-lg p-4 bg-gray-800 text-gray-100">
      <Bot className="h-4 w-4" />
      <div className="text-sm font-medium">"AI"</div>
      <div className="grid col-span-2 grid-cols-subgrid text-xs italic cursor-pointer" onClick={handleCollapse}>
      {collapsed
        ? <>
            <div className=" justify-self-end text-xs italic">Show Reasoning</div>
            <ArrowDownToLine className="size-4" />
          </>
        : <>  
            <div className=" justify-self-end text-xs italic">Hide Reasoning</div>
            <ArrowUpToLine className="size-4" />
          </>
      }
      </div>
      <article className="col-span-full prose max-w-none prose-invert prose-p:text-gray-100 prose-headings:text-gray-100 prose-strong:text-gray-100 prose-li:text-gray-100">
        <Markdown>{text}</Markdown>
      </article>
    </div>
  );
});


{/* <div className="text-xs italic cursor-pointer justify-self-end" onClick={handleCollapse}>
{collapsed
  ? <div className="">
      <ArrowUpToLine className="" />
      <div>show thinking</div>
    </div>
  : <div className="">
      <ArrowDownToLine className="" />
      <div>hide thinking</div>
    </div>
}
</div> */}