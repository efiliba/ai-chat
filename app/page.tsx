'use client';

import { useState } from 'react';
import Markdown from 'react-markdown';

import { streamAsyncIterator, createQueryString } from '@/utils';

export default function Home() {
  const [messages, setMessages] = useState('');

  const question = 'How do you spell peculer?';

  const getAssistantResponse = async () => {
    const response = await fetch(`/app/chat?${createQueryString({ question })}`);
    const reader = response.body?.getReader();
    for await (const value of streamAsyncIterator(reader!)) {
      setMessages(m => m + value)
    }
  };

  const handleLoadAssistantResponse = async () => {
    console.log('Clicked');
    setMessages('')
    getAssistantResponse();
  };

  return (
    <div className="">
      <input type="button" onClick={handleLoadAssistantResponse} value="Load Assistant Response" />
      <Markdown>
        {messages}
      </Markdown>
    </div>
  );
}
