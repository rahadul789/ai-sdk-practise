import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { pokemonSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const { type } = await req.json();

    const result = streamObject({
      model: openai("gpt-4.1-nano"),
      schema: pokemonSchema,
      output: "array", // default value is object
      prompt: `Generate a list of 5 ${type} type pokemon`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.log("Error generating recipe: ", error);
    return new Response("Failed to generate recipe", { status: 500 });
  }
}
