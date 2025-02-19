import { CircleAlert, CloudCog, Loader2 } from "lucide-react";

import { AIAnswer } from "@/components";

interface Props {
  error?: boolean;
  cancelled?: boolean;
  loading?: boolean;
  reasoning: string;
  answer: string;
  hideReasoning?: boolean;
  onToggleReasoning?: () => void;
}

const AIError = ({ error }: { error: string }) => (
  <div className="rounded-lg p-4 bg-red-700 text-gray-100 grid grid-cols-[auto_auto_1fr] items-center gap-3">
    <CircleAlert className="w-4 h-4" />
    <div className="text-sm font-medium">Error</div>
    <div className="col-span-3">{error}</div>
  </div>
);

const AILoading = () => (
  <div className="max-w-[90%] rounded-lg p-4 bg-gray-800 text-gray-100 grid grid-cols-[auto_auto_1fr_auto] items-center gap-3">
    <CloudCog className="w-4 h-4" />
    <div className="text-sm font-medium">&rdquo;AI&rdquo;</div>
    <div className="text-xs italic justify-self-end">Loading...</div>
    <Loader2 className="w-4 h-4 animate-spin" />
  </div>
);

export const AIResponse = ({
  error,
  cancelled,
  loading,
  reasoning,
  answer,
  hideReasoning,
  onToggleReasoning,
}: Props) => {
  switch (true) {
    case error:
      return <AIError error={reasoning} />;
    case loading && reasoning.length === 0:
      return <AILoading />;
    case reasoning.length > 0:
      return (
        <AIAnswer
          cancelled={cancelled}
          reasoning={reasoning}
          answer={answer}
          hideReasoning={hideReasoning}
          onToggleReasoning={onToggleReasoning}
        />
      );
    default:
      return null;
  }
};
