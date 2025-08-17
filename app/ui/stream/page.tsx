"use client";

import { Button } from "@/components/ui/button";
import { useCompletion } from "@ai-sdk/react";
import { useState } from "react";

export default function StreamPage() {
  const [prompt, setPrompt] = useState("");

  const {
    input,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error,
    setInput,
    stop,
  } = useCompletion({
    api: "/api/stream",
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setInput("");
          handleSubmit(e);
        }}
      >
        <div>
          <input
            placeholder="How can I help you"
            value={input}
            onChange={handleInputChange}
          />
          {isLoading ? (
            <Button onClick={stop}>Stop</Button>
          ) : (
            <Button disabled={isLoading}>Send</Button>
          )}
        </div>
      </form>
      {error && error.message}
      {isLoading && !completion && <div>Loading...</div>}
      {completion && <div className=" whitespace-pre-wrap">{completion}</div>}
    </div>
  );
}
