"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function StructuredDataPage() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSentiment = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setText("");
    try {
      const response = await fetch("/api/structured-enum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSentiment(data);
    } catch (error) {
      console.error("Error: ", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={analyzeSentiment}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze"
        />
        <Button disabled={isLoading || !text.trim()}>Analyze</Button>
      </form>
      {error && <div>{error}</div>}

      {isLoading ? (
        <div>Analyzing sentiment...</div>
      ) : sentiment ? (
        <div>
          {sentiment === "positive" && ":) Positive"}
          {sentiment === "negative" && ":( Negative"}
          {sentiment === "neutral" && ":| Neutral"}
        </div>
      ) : null}
    </div>
  );
}
