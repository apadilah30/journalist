export type NavigationTab = 'search' | 'explore' | 'paperview' | 'library';

export interface Author {
  name: string;
  affiliation?: string;
  superscript?: string;
  isCorresponding?: boolean;
}

export interface Paper {
  id: string;
  key: string;
  title: string;
  authors: Author[];
  authorsSummary: string;
  year: number;
  venue: string;
  venueFull?: string;
  presentationType?: string;
  doi: string;
  arxivId?: string;
  corpusId?: string;
  subject?: string;
  license?: string;
  openAccess: boolean;
  hasPdf: boolean;
  pdfUrl?: string;
  pdfSize?: string;
  citations: number;
  influentialCitations?: number;
  citationVelocity?: number;
  quarterGrowth?: number;
  referencesCount?: number;
  altmetricScore?: number;
  githubStars?: string;
  githubRepo?: string;
  reproducibilityScore?: number;
  abstract: string;
  notesSummary?: string;
  highlightsCount?: number;
  notesCount?: number;
  readStatus: 'read' | 'reading' | 'unread';
  isStarred?: boolean;
  collectionIds: string[];
  tags: string[];
  notesMarkdown?: string;
  extractedHighlights?: {
    id: string;
    page: number;
    section: string;
    col?: string;
    quote: string;
  }[];
  bibtex: string;
  apa: string;
  ris: string;
  endnote: string;
  ieee: string;
}

export interface Collection {
  id: string;
  name: string;
  icon: string;
  count: number;
  isProject?: boolean;
}

export interface EmergingTopic {
  id: string;
  domain: string;
  growth: string;
  title: string;
  description: string;
  momentum30d: string;
  keyResearchers: string[];
  keyResearchersCount: number;
  manuscriptsCount: string;
  trendPoints: number[];
}

export interface ReferenceItem {
  id: number;
  authorsYear: string;
  title: string;
  venue: string;
  citations: string;
  doi: string;
  role: string;
}

export interface SearchFilters {
  query: string;
  year?: string;
  publicationTypes?: string;
  fieldsOfStudy?: string;
  openAccessPdf?: boolean;
  minCitationCount?: number;
  sort?: string;
  offset?: number;
  limit?: number;
}
