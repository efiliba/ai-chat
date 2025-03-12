"use client";

import {
  memo,
  useRef,
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
} from "react";
import { MessageSquare, SendHorizontal, X } from "lucide-react";

import {
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
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
          "p-4 bg-secondary border rounded-lg border-primary/30 grid grid-cols-[1fr_auto] gap-x-2 container mx-auto max-w-4xl relative",
          className
        )}
        onSubmit={handleSubmit}
      >
        <Input
          ref={inputRef}
          className="pl-10 border-primary/20"
          value={input}
          disabled={loading}
          placeholder="Ask the AI a question"
          onChange={handleSetInput}
        />
        <MessageSquare className="absolute w-4 -translate-y-1/2 left-6 top-1/2" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90 hover:cursor-pointer"
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
            </TooltipTrigger>
            <TooltipContent>
              <p>{loading ? "Stop" : "Send"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    );
  }
);

QuestionInput.displayName = "QuestionInput";
