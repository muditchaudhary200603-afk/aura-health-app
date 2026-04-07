import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json({ message: "Chat is not configured." }, { status: 503 });
  }

  const body = (await request.json()) as { message?: string };
  const message = body.message?.trim() ?? "";

  if (!message) {
    return NextResponse.json({ message: "Message is required." }, { status: 400 });
  }

  try {
    const candidateModels = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
    let reply: string | null = null;

    for (const model of candidateModels) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          max_tokens: 180,
          messages: [
            {
              role: "system",
              content:
                "You are Aura Health's website assistant. Be concise, supportive, and helpful. Do not diagnose. Encourage booking or contacting the clinic for urgent issues."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
        const errorMessage = payload?.error?.message?.toLowerCase() || "";

        // Retry with the next model only when the model is not available.
        if (errorMessage.includes("model") && (errorMessage.includes("decommissioned") || errorMessage.includes("not found"))) {
          continue;
        }

        return NextResponse.json({ message: "Chat is temporarily unavailable." }, { status: 502 });
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = payload.choices?.[0]?.message?.content?.trim() ?? "";
      if (content) {
        reply = content;
        break;
      }
    }

    if (!reply) {
      return NextResponse.json({ message: "Chat is temporarily unavailable." }, { status: 502 });
    }

    return NextResponse.json({
      reply
    });
  } catch {
    return NextResponse.json({ message: "Chat is temporarily unavailable." }, { status: 502 });
  }
}
