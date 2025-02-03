"use client";

import { useState } from "react";
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



  // await assistantResponseAcion(setMessages);
  // assistantResponseAcion();

  const handleLoadAssistantResponse = async () => {
    console.log("Clicked");
    setMessages(await assistantResponseAcion());
  };

  return (
    <div className="">
      <input type="button" onClick={handleLoadAssistantResponse} value="Load Assistant Response" />
      {messages}
    </div>
  );
}
