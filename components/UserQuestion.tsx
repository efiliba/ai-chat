import { memo } from 'react';
import { UserRound } from 'lucide-react';
import Markdown from 'react-markdown';

export const UserQuestion = memo(({ text }: { text: string }) =>
  <div className="grid justify-self-end grid-cols-[auto_1fr] items-center gap-3 max-w-[90%] rounded-lg p-4 bg-primary text-black">
    <UserRound className="h-4 w-4" />
    <span className="text-sm font-medium">"You"</span>
    <article className="col-span-full prose max-w-none prose-invert prose-p:text-black prose-headings:text-black prose-strong:text-black prose-li:text-black">
      <Markdown className="font-serif">{text}</Markdown>
    </article>
  </div>);
