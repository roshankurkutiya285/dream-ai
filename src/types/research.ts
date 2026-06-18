/** Supported research query categories */
export type QueryType = "person" | "company" | "topic" | "event";

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface KeyFact {
  label: string;
  value: string;
}

export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export interface RelatedEntity {
  name: string;
  type: "person" | "company" | "topic";
  relevance: string;
}

export interface ResearchReport {
  executiveSummary: string;
  timeline: TimelineEvent[];
  keyFacts: KeyFact[];
  sources: Source[];
  relatedEntities: RelatedEntity[];
  researchQuestions: string[];
  interviewQuestions: string[];
  deepDiveQuestions: string[];
}

export interface ResearchSearch {
  id: string;
  query: string;
  query_type: QueryType;
  report: ResearchReport;
  sources: Source[];
  created_at: string;
}

export interface ResearchRequest {
  query: string;
  queryType: QueryType;
}

export const QUERY_TYPE_LABELS: Record<QueryType, string> = {
  person: "Person",
  company: "Company",
  topic: "Topic",
  event: "Event",
};

export const QUERY_TYPE_PLACEHOLDERS: Record<QueryType, string> = {
  person: "e.g. Marie Curie, Elon Musk, Ada Lovelace",
  company: "e.g. OpenAI, Tesla, Stripe",
  topic: "e.g. Quantum Computing, Climate Tech",
  event: "e.g. Moon Landing 1969, COVID-19 Pandemic",
};
