import type { EntityBase } from "./common.types";

export type Article = EntityBase & {
  title: string;
  abstract?: string | null;
  doi?: string | null;
  source?: string | null;
  status?: string | null;
  publicationYear?: number;
  publicationMonth?: number | null;
  issueId?: string;
  journalTitle?: string;
  journalId?: string;
  authors?: Array<{ id?: string; fullName?: string; firstName?: string; lastName?: string }>;
  keywords?: Array<{ id?: string; word?: string; normalizedWord?: string }>;
};

export type Journal = EntityBase & {
  title: string;
  issn?: string;
  eIssn?: string;
  publisherId?: string;
  subjectAreaId?: string;
  impactFactor?: number;
};
