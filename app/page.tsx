"use client";

import { useCallback, useState } from "react";
import { assistantResponseAcion } from "@/server/assistantResponseAcion";

/*
CURL -N "http://127.0.0.1:11434/api/chat" \
-d '{
  "model": "deepseek-r1",
  "messages": [{"role": "user", "content": "Hello"}]
}'
*/

export default function Home() {
  const [messages, setMessages] = useState("");

  const callback = useCallback((chunk: string) => setMessages(currentMessage => {
    console.log({chunk});
    
    return currentMessage + chunk
  }), []);

  // await assistantResponseAcion(setMessages);
  // assistantResponseAcion();

  const handleLoadAssistantResponse = async () => {
    console.log("Clicked");
    // setMessages(await assistantResponseAcion());
    assistantResponseAcion(callback);
  };

  return (
    <div className="">
      <input type="button" onClick={handleLoadAssistantResponse} value="Load Assistant Response" />
      {messages}
    </div>
  );
}
