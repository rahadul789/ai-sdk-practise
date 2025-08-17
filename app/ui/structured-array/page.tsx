"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { pokemonUISchema } from "@/app/api/structured-array/schema";

export default function StructuredDataPage() {
  const [type, setType] = useState("");

  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/structured-array",
    schema: pokemonUISchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ type });
    setType("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Enter a dish name"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          {isLoading ? (
            <Button type="submit" onClick={stop}>
              Stop
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading || !type}>
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          )}
        </div>
      </form>
      {object?.map((pokemon) => (
        <div key={pokemon?.name}>
          <h2>{pokemon?.name}</h2>
          <div>
            {pokemon?.abilities?.map((ability) => (
              <div key={ability}>{ability}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
