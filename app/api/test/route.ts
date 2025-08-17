import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { responseSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const { dish } = await req.json();

    const result = streamObject({
      model: openai("gpt-4.1-nano"),
      schema: responseSchema,
      // output: "array", // default value is object

      prompt: ` ${dish}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.log("Error generating recipe: ", error);
    return new Response("Failed to generate recipe", { status: 500 });
  }
}
