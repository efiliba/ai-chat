import { CircleAlert, CloudCog } from "lucide-react";
import { AIAnswer } from "@/components";

interface Props {
  error?: boolean;
  loading?: boolean;
  reasoning: string;
  answer: string;
}

const AIError = ({ error }: { error: string }) => (
  <div className="rounded-lg p-4 bg-red-700 text-gray-100 grid grid-cols-[auto_auto_1fr] items-center gap-3">
    <CircleAlert className="w-4 h-4" />
    <div className="text-sm font-medium">Error</div>
    <div className="col-span-3">{error}</div>
  </div>
);

const AILoading = () => (
  <div className="max-w-[90%] rounded-lg p-4 bg-gray-800 text-gray-100 grid grid-cols-[auto_auto_1fr] items-center gap-3">
    <CloudCog className="w-4 h-4" />
    <div className="text-sm font-medium">&rdquo;AI&rdquo;</div>
    <div className="justify-self-end text-xs italic motion-preset-typewriter-[10]">
      Loading...
    </div>
  </div>
);

export const AIResponse = ({ error, loading, reasoning, answer }: Props) => {
  switch (true) {
    case error:
      return <AIError error={reasoning} />;
    case loading && reasoning.length === 0:
      return <AILoading />;
    case reasoning.length > 0:
      return <AIAnswer reasoning={reasoning} answer={answer} />;
    default:
      return null;
  }
};
