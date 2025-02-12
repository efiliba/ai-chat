import { memo, useState, FormEvent, ChangeEvent } from "react";
import { MessageSquare, SendHorizontal, X } from "lucide-react";

import { Button, Input } from "@/components/ui";

export const QuestionInput = memo(
  ({
    loading,
    onSubmit,
    onCancel,
  }: {
    loading: boolean;
    onSubmit: (input: string) => void;
    onCancel: () => void;
  }) => {
    const [input, setInput] = useState("");

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
        className="p-4 bg-gray-800 border-t border-gray-700 grid grid-cols-[1fr_auto] gap-x-2 container mx-auto max-w-4xl relative"
        onSubmit={handleSubmit}
      >
        <Input
          className="bg-gray-900 border-gray-700 text-gray-100 pl-10"
          value={input}
          disabled={loading}
          placeholder="Ask the AI a question"
          onChange={handleSetInput}
        />
        <MessageSquare className="absolute left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Button
          className="bg-primary hover:bg-primary/90"
          type="submit"
          disabled={input.trim().length === 0 && !loading}
        >
          {loading ? (
            <X className="h-4 w-4" />
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
          <span className="sr-only">{loading ? "Stop" : "Send"}</span>
        </Button>
      </form>
    );
  }
);

QuestionInput.displayName = "QuestionInput";
