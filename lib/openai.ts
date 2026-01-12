import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY n'est pas définie. Les fonctionnalités IA seront désactivées.");
}

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export async function callOpenAI(
  prompt: string,
  systemPrompt?: string,
  temperature: number = 0.7
): Promise<string | null> {
  if (!openai) {
    return "Les fonctionnalités IA ne sont pas disponibles. Veuillez configurer OPENAI_API_KEY.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
        { role: "user" as const, content: prompt },
      ],
      temperature,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    return null;
  }
}

