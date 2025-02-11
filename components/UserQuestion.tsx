import { memo } from 'react';
import { UserRound } from 'lucide-react';

export const UserQuestion = memo(({ text }: { text: string }) =>
  <div className="grid justify-self-end grid-cols-[auto_1fr] items-center gap-3 max-w-[90%] rounded-lg p-4 bg-primary text-black">
    <UserRound className="h-4 w-4" />
    <span className="text-sm font-medium">"You"</span>
    <article className="col-span-full font-serif">{text}</article>
  </div>);
