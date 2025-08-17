"use client";

import { Button } from "@/components/ui/button";
import { useChat, useCompletion } from "@ai-sdk/react";
import { useState } from "react";

export default function StreamPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="How can I help you"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {status === "submitted" || status === "streaming" ? (
            <Button onClick={stop}>Stop</Button>
          ) : (
            <Button disabled={status !== "ready"}>Send</Button>
          )}
        </div>
      </form>
      {error && <p>{error.message}</p>}
      {(status === "submitted" || status === "streaming") && <p>Loading...</p>}
      {messages.map((message) => (
        <div key={message.id}>
          <div>{message.role === "user" ? "You:" : "AI:"}</div>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case "text":
                return <div key={`${message.id}-${index}}`}>{part.text}</div>;
              default:
                return null;
            }
          })}
        </div>
      ))}
    </div>
  );
}
