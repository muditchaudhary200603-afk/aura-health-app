type TriageInput = {
  departmentOrService: string;
  message: string;
  preferredDate: string | null;
  specialistSlug: string | null;
};

export async function generateIntakeSummary(input: TriageInput) {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey || !input.message) {
    return null;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
        max_tokens: 140,
        messages: [
          {
            role: "system",
            content:
              "Summarize medical intake requests for internal clinic staff. Keep it short, plain text, and non-diagnostic. Return 2 lines only: Summary: ... Urgency: ..."
          },
          {
            role: "user",
            content: JSON.stringify(input)
          }
        ]
      })
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return payload.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}
