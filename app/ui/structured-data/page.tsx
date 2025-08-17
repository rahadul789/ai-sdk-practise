"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/app/api/structured-data/schema";

export default function StructuredDataPage() {
  const [dishName, setDishName] = useState("");

  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/structured-data",
    schema: recipeSchema,
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
      {object?.recipe && (
        <div>
          <h2>{object.recipe.name}</h2>
          {object?.recipe?.ingredients && (
            <div>
              <h3>Ingredients</h3>
              <div>
                {object?.recipe?.ingredients.map((ingeredient, index) => (
                  <div key={index} className=" border bg-cyan-200">
                    <p>{ingeredient?.name}</p>
                    <p>{ingeredient?.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {object?.recipe?.steps && (
            <div>
              <h3>Steps</h3>
              <ol>
                {object.recipe.steps.map((step, index) => (
                  <li className=" shadow-2xl bg-amber-50 mb-2" key={index}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
