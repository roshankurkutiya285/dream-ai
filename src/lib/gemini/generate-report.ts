import Groq from "groq-sdk";
import type { QueryType, ResearchReport } from "@/types/research";

const apiKey = process.env.GROQ_API_KEY;

/** Models to try in order — all free on Groq */
const MODELS = [
  "llama-3.3-70b-versatile",   // Best quality, free
  "llama-3.1-8b-instant",      // Fastest, free fallback
  "mixtral-8x7b-32768",        // Alternative fallback
];

/** Check if Groq API key is configured */
export function isGeminiConfigured(): boolean {
  return Boolean(apiKey);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isRetryableError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes("429") ||
    message.includes("503") ||
    message.includes("rate_limit") ||
    message.includes("overloaded") ||
    message.includes("quota")
  );
}

function buildPrompt(query: string, queryType: QueryType): string {
  const typeContext: Record<QueryType, string> = {
    person: "a notable person (biography, career, impact, controversies)",
    company: "a company or organization (history, products, leadership, market position)",
    topic: "a research topic or industry (trends, key players, challenges, future outlook)",
    event: "a historical or current event (causes, timeline, impact, aftermath)",
  };

  return `You are a senior research analyst. Create a comprehensive intelligence report about the following.

Research Subject: "${query}"
Category: ${queryType} — ${typeContext[queryType]}

Return ONLY a valid JSON object with exactly this structure (no markdown, no explanation):
{
  "executiveSummary": "2-4 paragraph summary",
  "timeline": [
    { "date": "Year or date", "title": "Event title", "description": "What happened" }
  ],
  "keyFacts": [
    { "label": "Fact label", "value": "Fact value" }
  ],
  "sources": [
    { "title": "Source title", "url": "https://...", "snippet": "Brief description" }
  ],
  "relatedEntities": [
    { "name": "Name", "type": "person|company|topic", "relevance": "Why relevant" }
  ],
  "researchQuestions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
  "interviewQuestions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
  "deepDiveQuestions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
}

Requirements:
- Include 5-8 timeline events in chronological order
- Include 6-10 key facts with clear labels
- Cite 5-8 real, verifiable sources with actual URLs
- List 4-6 related people, companies, or topics
- Generate exactly 5 questions for each question category
- Be factual and balanced`;
}

function formatError(error: unknown): string {
  const message = getErrorMessage(error);
  const lower = message.toLowerCase();

  if (lower.includes("429") || lower.includes("rate_limit") || lower.includes("quota")) {
    return "AI is temporarily rate-limited. Please wait a moment and try again.";
  }
  if (lower.includes("401") || lower.includes("invalid_api_key") || lower.includes("expired")) {
    return "Invalid or expired Groq API key. Please check your GROQ_API_KEY in .env.local.";
  }
  if (lower.includes("503") || lower.includes("overloaded")) {
    return "AI service is temporarily overloaded. Please try again in a few seconds.";
  }

  return message || "Failed to generate research report";
}

/**
 * Generate a structured research report using Groq (free tier).
 * Tries each model in order, falls back on quota/rate-limit errors.
 */
export async function generateResearchReport(
  query: string,
  queryType: QueryType
): Promise<ResearchReport> {
  if (!apiKey) {
    throw new Error(
      "Groq API key is not configured. Add GROQ_API_KEY to .env.local — get a free key at https://console.groq.com"
    );
  }

  const groq = new Groq({ apiKey });
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "You are a research analyst. Always respond with valid JSON only, no markdown formatting.",
          },
          {
            role: "user",
            content: buildPrompt(query, queryType),
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 4096,
      });

      const text = completion.choices[0]?.message?.content;
      if (!text) {
        throw new Error("AI returned an empty response. Please try again.");
      }

      try {
        return JSON.parse(text) as ResearchReport;
      } catch {
        throw new Error("Failed to parse research report. Please try again.");
      }
    } catch (error) {
      lastError = error;
      if (!isRetryableError(error)) throw error;
      // Rate limited on this model — try next model immediately
    }
  }

  throw new Error(formatError(lastError));
}
