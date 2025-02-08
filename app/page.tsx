'use client';

import { memo, useState } from 'react';
import Markdown from 'react-markdown';
import { Bot, Loader2, MessageSquare, Send, User2 } from 'lucide-react';

import { Button, Input } from '@/components/ui';
import { streamAsyncIterator, createQueryString } from '@/utils';

const AIMessage: React.FC<{ message: any }> = ({ message }) => {
  const [collapsed, setCollapsed] = useState(true)

  console.log('message', message);
  
  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${message.role === "user"
          ? "bg-primary text-black"
          : "bg-gray-800 text-gray-100"
          }`}
      >
        <div className="flex items-center gap-2 mb-2" style={{ justifyContent: "space-between" }}>
          <span className="text-sm font-medium" style={{ display: "flex", gap: 10 }}>
            {message.role === "user" ? (
              <User2 className="h-4 w-4" />
            ) : (
              !message.finishedThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />
            )}

            <span>{message.role === "user" ? "You" : "DeepSeek R1 (32b)"}</span>
          </span>
          <span>
            {message.role === "assistant" && (
              <span
                style={{ cursor: "pointer", fontStyle: "italic", fontSize: "12px" }}
                onClick={() => setCollapsed((c) => !c)}
              >
                {collapsed ? "show thoughts" : "hide thoughts"}
              </span>
            )}
          </span>
        </div>

        {message.role === "assistant" && !message.finishedThinking && (
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm">Thinking...</span>
          </div>
        )}

        {message.think && (
          <div style={{ display: collapsed ? "none" : "block" }} className="mb-2 text-sm italic border-l-2 border-gray-600 pl-2 py-1 text-gray-300">
            <Markdown>{message.think}</Markdown>
          </div>
        )}
        <article
          className={`prose max-w-none ${message.role === "user"
            ? "prose-invert prose-p:text-black prose-headings:text-black prose-strong:text-black prose-li:text-black"
            : "prose-invert prose-p:text-gray-100 prose-headings:text-gray-100 prose-strong:text-gray-100 prose-li:text-gray-100"
            }`}
        >
          <Markdown>{message.content}</Markdown>
        </article>
      </div>
    </div>
  )
};

const UserMessage = memo(({ text }: { text: string }) => {
  console.log('user message', text);

  return (
    <div className="grid justify-self-end max-w-[90%] rounded-lg p-4 bg-primary text-black">
      <div className="flex items-center gap-2 mb-2" style={{ justifyContent: "space-between" }}>
        <span className="text-sm font-medium" style={{ display: "flex", gap: 10 }}>
          <User2 className="h-4 w-4" />
          <span>"You"</span>
        </span>
      </div>
      <article
        className="prose max-w-none prose-invert prose-p:text-black prose-headings:text-black prose-strong:text-black prose-li:text-black">
        <Markdown>{text}</Markdown>
      </article>
    </div>
  )
});

const AssistantMessage = memo(({ text }: { text: string }) => {
  const [collapsed, setCollapsed] = useState(true)

  console.log('assistant message', text);
  
  return (
    <div className="grid justify-self-start max-w-[90%] rounded-lg p-4 bg-gray-800 text-gray-100">
      <div className="flex items-center gap-2 mb-2" style={{ justifyContent: "space-between" }}>
        <span className="text-sm font-medium" style={{ display: "flex", gap: 10 }}>
          <Bot className="h-4 w-4" />
          <span>"DeepSeek R1 (32b)"</span>
        </span>
        <span>
            <span
              style={{ cursor: "pointer", fontStyle: "italic", fontSize: "12px" }}
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? "show thoughts" : "hide thoughts"}
            </span>
        </span>
      </div>
      <article
        className="prose max-w-none prose-invert prose-p:text-gray-100 prose-headings:text-gray-100 prose-strong:text-gray-100 prose-li:text-gray-100">
        <Markdown>{text}</Markdown>
      </article>
    </div>
  )
});

type Message = {
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
};

export default function Home() {
  const [aiResponse, setAIResponse] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [premise, setPremise] = useState("You are a software developer with a focus on React/TypeScript.\rKeep your answer simple and straight forward.");
  const [loading, setLoading] = useState(false);

  const question = 'Hello'; // 'How do you spell peculer?';

  const handleLoadAssistantResponse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setChatHistory(chat => chat
      .concat(aiResponse ? [{role: 'assistant', content: aiResponse}] : []) // Previous AI response
      .concat({role: 'user', content: input}));

    setLoading(true);
    setInput('');
    setAIResponse('');

    // ...history,
    // { role: "system", content: premise },
    // { role: "user", content: input },

// Keep your answer simple and straight forward.
// This can change: set as system role
    const response = await fetch(`/api/chat?${createQueryString({ question })}`);
    const reader = response.body?.getReader();

    for await (const value of streamAsyncIterator(reader!)) {
      setAIResponse(m => m + value);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen grid content-between">
      <div className="p-4 container mx-auto max-w-4xl space-y-4 overflow-scroll">
        {chatHistory.map(({role, content}, index) =>
          role === 'user'
            ? <UserMessage key={index} text={content} />
            : <AssistantMessage key={index} text={content} />
        )}
        {aiResponse.length > 0 && <AssistantMessage text={aiResponse} />}
      </div>
      {/* <div className="p-4 bg-gray-800 border-t border-gray-700"> */}
        <form className="p-4 bg-gray-800 border-t border-gray-700 grid grid-cols-[1fr_auto] gap-x-2 container mx-auto max-w-4xl relative" onSubmit={handleLoadAssistantResponse}>
          {/* <div className="grid gap-2"> */}
            {/* <div className=""> */}
              <Input
                className="bg-gray-900 border-gray-700 text-gray-100 pl-10"
                value={input}
                disabled={loading}
                placeholder="Ask your local DeepSeek..."
                onChange={(e) => setInput(e.target.value)}
              />
              <MessageSquare className="absolute left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {/* </div> */}
            <Button
              className="bg-primary hover:bg-primary/90"
              type="submit"
              disabled={loading || !input.trim() && false}
            >
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />
              }
              <span className="sr-only">Send message</span>
            </Button>
          {/* </div> */}
        </form>
      {/* </div> */}
    </div>
  );
}
