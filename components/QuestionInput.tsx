import {
  memo,
  useRef,
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
} from "react";
import { MessageSquare, SendHorizontal, X } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  loading: boolean;
  focus?: boolean;
  onSubmit: (input: string) => void;
  onCancel: () => void;
}

export const QuestionInput = memo(
  ({ className, loading, focus, onSubmit, onCancel }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [input, setInput] = useState("");

    useEffect(() => {
      if (focus) {
        inputRef.current?.focus();
      }
    }, [focus]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (loading) {
        onCancel();
      } else {
        onSubmit(input);
        setInput("");
      }
    };

    const handleSetInput = (e: ChangeEvent<HTMLInputElement>) =>
      setInput(e.target.value);

    return (
      <form
        className={cn(
          "p-4 bg-gray-800 border-t border-gray-700 grid grid-cols-[1fr_auto] gap-x-2 container mx-auto max-w-4xl relative",
          className
        )}
        onSubmit={handleSubmit}
      >
        <Input
          ref={inputRef}
          className="pl-10 text-gray-100 bg-gray-900 border-gray-700"
          value={input}
          disabled={loading}
          placeholder="Ask the AI a question"
          onChange={handleSetInput}
        />
        <MessageSquare className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-6 top-1/2" />
        <Button
          className="bg-primary hover:bg-primary/90"
          type="submit"
          disabled={input.trim().length === 0 && !loading}
        >
          {loading ? (
            <X className="w-4 h-4" />
          ) : (
            <SendHorizontal className="w-4 h-4" />
          )}
          <span className="sr-only">{loading ? "Stop" : "Send"}</span>
        </Button>
      </form>
    );
  }
);

QuestionInput.displayName = "QuestionInput";
