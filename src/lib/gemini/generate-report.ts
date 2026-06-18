import { GoogleGenAI, Type } from "@google/genai";
import type { QueryType, ResearchReport } from "@/types/research";

const apiKey = process.env.GEMINI_API_KEY;

/** Primary model from env, with free-tier-friendly fallbacks (least busy first) */
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
] as const;

const RETRY_DELAY_MS = 2000;

/** Check if Gemini API key is configured */
export function isGeminiConfigured(): boolean {
  return Boolean(apiKey);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** JSON schema for structured research report output */
const reportSchema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.STRING,
      description: "A concise 2-4 paragraph executive summary of the research subject",
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "Date or time period (e.g. '1920', 'Jan 2020')" },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["date", "title", "description"],
      },
    },
    keyFacts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          value: { type: Type.STRING },
        },
        required: ["label", "value"],
      },
    },
    sources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          url: { type: Type.STRING },
          snippet: { type: Type.STRING },
        },
        required: ["title", "url"],
      },
    },
    relatedEntities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["person", "company", "topic"] },
          relevance: { type: Type.STRING },
        },
        required: ["name", "type", "relevance"],
      },
    },
    researchQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Open research questions to explore further",
    },
    interviewQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Questions suitable for interviewing experts or subjects",
    },
    deepDiveQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Advanced analytical questions for in-depth investigation",
    },
  },
  required: [
    "executiveSummary",
    "timeline",
    "keyFacts",
    "sources",
    "relatedEntities",
    "researchQuestions",
    "interviewQuestions",
    "deepDiveQuestions",
  ],
};

function buildPrompt(query: string, queryType: QueryType, useSearch: boolean): string {
  const typeContext: Record<QueryType, string> = {
    person: "a notable person (biography, career, impact, controversies)",
    company: "a company or organization (history, products, leadership, market position)",
    topic: "a research topic or industry (trends, key players, challenges, future outlook)",
    event: "a historical or current event (causes, timeline, impact, aftermath)",
  };

  const searchNote = useSearch
    ? "1. Use Google Search to find current, accurate information from reputable sources."
    : "1. Use your knowledge to provide accurate, well-sourced information.";

  return `You are a senior research analyst creating a comprehensive intelligence report.

Research Subject: "${query}"
Category: ${queryType} — ${typeContext[queryType]}

Instructions:
${searchNote}
2. Synthesize findings into a structured intelligence report — not a chat response.
3. Include 5-8 timeline events in chronological order.
4. Include 6-10 key facts with clear labels.
5. Cite 5-8 real, verifiable sources with actual URLs (Wikipedia, news sites, official pages, academic sources).
6. List 4-6 related people, companies, or topics.
7. Generate 5 research questions, 5 interview questions, and 5 deep-dive questions.
8. Be factual, balanced, and note uncertainty where information is disputed.
9. Write for researchers, journalists, podcasters, and founders who need actionable intelligence.`;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Errors where we should try the next model or retry */
function isRetryableError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes("429") ||
    message.includes("503") ||
    message.includes("resource_exhausted") ||
    message.includes("unavailable") ||
    message.includes("high demand") ||
    message.includes("quota") ||
    message.includes("overloaded")
  );
}

function formatGeminiError(error: unknown): string {
  const message = getErrorMessage(error);
  const lower = message.toLowerCase();

  if (lower.includes("high demand") || lower.includes("503") || lower.includes("unavailable")) {
    return "Gemini is temporarily overloaded. Please wait 30 seconds and try again. The app will automatically try backup models.";
  }

  if (lower.includes("429") || lower.includes("quota") || lower.includes("resource_exhausted")) {
    const retryMatch = message.match(/retry in ([\d.]+)s/i);
    const retryNote = retryMatch
      ? ` Try again in about ${Math.ceil(parseFloat(retryMatch[1]))} seconds.`
      : " Wait a minute and try again.";

    return `Gemini API quota exceeded.${retryNote} Set GEMINI_MODEL=gemini-2.0-flash-lite in .env.local for a lighter model.`;
  }

  return message || "Failed to generate research report";
}

function getModelsToTry(): string[] {
  const models = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  return [...new Set(models)];
}

async function tryGenerate(
  ai: GoogleGenAI,
  model: string,
  query: string,
  queryType: QueryType,
  useSearch: boolean
): Promise<ResearchReport> {
  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(query, queryType, useSearch),
    config: {
      ...(useSearch ? { tools: [{ googleSearch: {} }] } : {}),
      responseMimeType: "application/json",
      responseSchema: reportSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty response. Please try again.");
  }

  try {
    return JSON.parse(text) as ResearchReport;
  } catch {
    throw new Error("Failed to parse research report. Please try again.");
  }
}

/**
 * Generate a structured research report using Gemini.
 * Automatically retries with backup models on quota or overload errors.
 */
export async function generateResearchReport(
  query: string,
  queryType: QueryType
): Promise<ResearchReport> {
  if (!apiKey) {
    throw new Error(
      "Gemini API is not configured. Set GEMINI_API_KEY in your environment variables."
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const models = getModelsToTry();
  let lastError: unknown;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];

    if (i > 0) await sleep(RETRY_DELAY_MS);

    const attempts = [
      { useSearch: true },
      { useSearch: false },
    ];

    for (const { useSearch } of attempts) {
      try {
        return await tryGenerate(ai, model, query, queryType, useSearch);
      } catch (error) {
        lastError = error;

        if (useSearch) {
          // If search grounding failed (e.g. 400: tool use + JSON schema unsupported,
          // or 404: model not found for this combination), fall through to the
          // non-search attempt rather than aborting the entire operation.
          continue;
        }

        // Non-search attempt also failed — only keep trying other models
        // if this is a transient/quota error (429, 503, etc.).
        if (!isRetryableError(error)) throw error;
      }
    }
  }

  throw new Error(formatGeminiError(lastError));
}
