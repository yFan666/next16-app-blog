import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { DEEPSEEK_API_KEY } from "./key";

const deepSeek = createDeepSeek({
  apiKey: DEEPSEEK_API_KEY,
});

type ModelRole = "system" | "user" | "assistant" | "tool";

function isModelRole(value: unknown): value is ModelRole {
  return (
    value === "system" ||
    value === "user" ||
    value === "assistant" ||
    value === "tool"
  );
}

function extractMessageText(message: unknown): string {
  if (message == null || typeof message !== "object") return "";

  const maybeAny = message as Record<string, unknown>;

  const content = maybeAny.content;
  if (typeof content === "string") return content;

  const parts = maybeAny.parts;
  if (Array.isArray(parts)) {
    const texts = parts
      .map((part) => {
        if (part == null || typeof part !== "object") return "";
        const maybePart = part as Record<string, unknown>;
        if (maybePart.type === "text" && typeof maybePart.text === "string") {
          return maybePart.text;
        }
        return "";
      })
      .filter(Boolean);
    if (texts.length > 0) return texts.join("");
  }

  if (Array.isArray(content)) {
    const texts = content
      .map((part) => {
        if (part == null || typeof part !== "object") return "";
        const maybePart = part as Record<string, unknown>;
        if (maybePart.type === "text" && typeof maybePart.text === "string") {
          return maybePart.text;
        }
        return "";
      })
      .filter(Boolean);
    if (texts.length > 0) return texts.join("");
  }

  return "";
}

function toModelMessages(input: unknown) {
  if (!Array.isArray(input)) {
    throw new Error("Invalid prompt: messages must be an array");
  }

  return input
    .map((message) => {
      if (message == null || typeof message !== "object") return null;
      const maybeAny = message as Record<string, unknown>;
      const role = maybeAny.role;
      if (!isModelRole(role)) return null;

      const text = extractMessageText(message);
      return {
        role,
        content: [{ type: "text", text }],
      } as const;
    })
    .filter((v) => v != null);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = (body as { messages?: unknown }).messages;

  try {
    const result = streamText({
      model: deepSeek("deepseek-chat"),
      messages: toModelMessages(messages),
      system: "你是一个高级程序员，请根据用户的问题给出回答",
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid prompt: unknown error";
    return Response.json({ error: message }, { status: 400 });
  }
}
