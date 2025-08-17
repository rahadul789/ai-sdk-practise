import { openai } from "@ai-sdk/openai";
import { generateObject, streamObject } from "ai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const result = await generateObject({
      model: openai("gpt-4.1-mini"), // we use mini here. coz its better
      output: "enum",
      enum: ["positive", "negative", "neutral"],
      prompt: `Classify the sentiment is ${text}`,
    });

    return result.toJsonResponse();
  } catch (error) {
    console.log("Error generating recipe: ", error);
    return new Response("Failed to generate recipe", { status: 500 });
  }
}
