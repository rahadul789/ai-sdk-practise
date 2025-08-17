"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { responseSchema } from "@/app/api/test/schema";

export default function StructuredDataPage() {
  const [dishName, setDishName] = useState("");

  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/test",
    schema: responseSchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ dish: dishName });
    setDishName("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Enter a dish name"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
          />
          {isLoading ? (
            <Button type="submit" onClick={stop}>
              Stop
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading || !dishName}>
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          )}
        </div>
      </form>
      {object?.response && (
        <div>
          <h2>
            <span className=" font-bold">Title: </span>
            {object.response.title}
          </h2>
          <div>
            <span className=" font-bold">Response: </span>
            {object.response.aiResponse}
          </div>
        </div>
      )}
    </div>
  );
}
