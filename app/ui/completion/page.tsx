"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CompletionPage() {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState(""); // ai response
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState([
    {
      role: "",
      text: "",
    },
  ]);
  console.log(messages);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrompt("");

    //   setMessages((prevArray) => [...prevArray, prompt]);
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: prompt,
      },
    ]);
    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.text,
        },
      ]);
    } catch (error) {
      console.log(error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="How can I help you"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button disabled={isLoading}>Send</Button>
        </div>
      </form>
      {error && <div>{error}</div>}
      {/* {isLoading ? (
        <div>Loading...</div>
      ) : messages ? (
        <div className=" whitespace-pre-wrap">{messages}</div>
      ) : null} */}
      {messages.map((message, i) => (
        <div key={i}>
          {message.role} <br />
          {message.text}
        </div>
      ))}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
