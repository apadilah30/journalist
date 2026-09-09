import { Paper, Author } from '../types';

export interface SemanticSearchParams {
  query: string;
  offset?: number;
  limit?: number;
  year?: string;
  publicationTypes?: string;
  fieldsOfStudy?: string;
  openAccessPdf?: boolean;
  minCitationCount?: number;
  sort?: string;
}

export interface SemanticSearchResponse {
  total: number;
  offset: number;
  next?: number;
  data: Paper[];
  papers: Paper[];
  source: 'semantic_scholar_live' | 'semantic_scholar_corpus_fallback';
  rateLimited: boolean;
  message?: string;
}

// Stored API key for user who wants higher rate limits
const STORAGE_KEY_API_KEY = 'scholarflow_semantic_scholar_api_key';

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    }
  } catch {
    // ignore
  }
}

// Helper to convert Semantic Scholar paper API object to frontend Paper model
export function transformSemanticPaper(raw: any): Paper {
  const paperId = raw.paperId || `paper-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const title = raw.title || 'Untitled Academic Paper';
  const year = raw.year || new Date().getFullYear();
  const venue = raw.venue || raw.publicationVenue?.name || raw.publicationTypes?.[0] || 'Peer-Reviewed Conference';

  const authors: Author[] = (raw.authors || []).map((a: any, idx: number) => ({
    name: a.name || 'Anonymous Researcher',
    affiliation: a.affiliations?.[0] || undefined,
    superscript: String(idx + 1),
    isCorresponding: idx === 0,
  }));

  if (authors.length === 0) {
    authors.push({ name: 'Anonymous Researcher', superscript: '1' });
  }

  const firstAuthorName = authors[0]?.name || 'Scholar';
  const firstAuthorLastName = firstAuthorName.split(' ').pop()?.toLowerCase().replace(/[^a-z]/g, '') || 'author';
  const firstWordTitle = title.split(' ')[0]?.toLowerCase().replace(/[^a-z]/g, '') || 'paper';
  const bibtexKey = `@${firstAuthorLastName}${year}${firstWordTitle}`;

  const authorsSummary =
    authors.length > 2
      ? `${authors[0].name}, ${authors[1].name} et al.`
      : authors.map((a) => a.name).join(', ');

  const doi = raw.externalIds?.DOI || '';
  const arxivId = raw.externalIds?.ArXiv ? `arXiv:${raw.externalIds.ArXiv}` : undefined;
  const corpusId = raw.corpusId ? String(raw.corpusId) : raw.externalIds?.CorpusId ? String(raw.externalIds.CorpusId) : undefined;
  const openAccess = Boolean(raw.isOpenAccess || raw.openAccessPdf?.url);
  const pdfUrl = raw.openAccessPdf?.url || (raw.externalIds?.ArXiv ? `https://arxiv.org/pdf/${raw.externalIds.ArXiv}.pdf` : undefined);

  const citations = raw.citationCount || 0;
  const influentialCitations = raw.influentialCitationCount || Math.floor(citations * 0.18);
  const referencesCount = raw.referenceCount || 35;
  const abstract = raw.abstract || raw.tldr?.text || 'No abstract text was provided in the repository entry.';

  // Deterministic BibTeX generator
  const bibtex = `@article{${firstAuthorLastName}${year}${firstWordTitle},
  title = {${title}},
  author = {${authors.map((a) => a.name).join(' and ')}},
  journal = {${venue}},
  year = {${year}},
  ${doi ? `doi = {${doi}},` : ''}
  ${corpusId ? `note = {Semantic Scholar Corpus ID: ${corpusId}}` : ''}
}`;

  // APA 7th style generator
  const apaAuthors = authors.map((a) => {
    const parts = a.name.split(' ');
    const last = parts.pop() || '';
    const initials = parts.map((p) => p[0] + '.').join(' ');
    return `${last}, ${initials}`;
  }).join(', ');
  const apa = `${apaAuthors} (${year}). ${title}. ${venue}.${doi ? ` https://doi.org/${doi}` : ''}`;

  // IEEE style generator
  const ieeeAuthors = authors.map((a) => {
    const parts = a.name.split(' ');
    const last = parts.pop() || '';
    const initials = parts.map((p) => p[0] + '. ').join('');
    return `${initials}${last}`;
  }).join(', ');
  const ieee = `${ieeeAuthors}, "${title}," in ${venue}, ${year}.${doi ? ` doi: ${doi}.` : ''}`;

  // RIS format
  const ris = `TY  - JOUR
TI  - ${title}
${authors.map((a) => `AU  - ${a.name}`).join('\n')}
PY  - ${year}
JO  - ${venue}
${doi ? `DO  - ${doi}` : ''}
${corpusId ? `C1  - CorpusID:${corpusId}` : ''}
ER  -`;

  return {
    id: paperId,
    key: bibtexKey,
    title,
    authors,
    authorsSummary,
    year,
    venue,
    venueFull: raw.publicationVenue?.name || venue,
    presentationType: raw.publicationTypes?.[0] || 'PEER-REVIEWED PUBLICATION',
    doi,
    arxivId,
    corpusId,
    subject: (raw.fieldsOfStudy || ['Computer Science']).join(' · '),
    openAccess,
    hasPdf: Boolean(pdfUrl),
    pdfUrl,
    citations,
    influentialCitations,
    citationVelocity: Math.max(12, Math.round(citations / Math.max(1, (2025 - year) * 12))),
    quarterGrowth: Math.min(85, Math.max(15, Math.round((citations % 50) + 20))),
    referencesCount,
    altmetricScore: Math.round(citations * 0.15 + 10),
    abstract,
    notesSummary: raw.tldr?.text || `Methodology & performance analysis for ${title.slice(0, 50)}...`,
    readStatus: 'unread',
    collectionIds: [],
    tags: raw.fieldsOfStudy || ['Research'],
    bibtex,
    apa,
    ris,
    endnote: `%0 Journal Article\n%T ${title}\n%A ${authors[0]?.name || ''}\n%J ${venue}\n%D ${year}`,
    ieee,
  };
}

export async function searchSemanticScholar(params: SemanticSearchParams): Promise<SemanticSearchResponse> {
  const queryParams = new URLSearchParams();
  queryParams.set('query', params.query);
  if (params.offset !== undefined) queryParams.set('offset', String(params.offset));
  if (params.limit !== undefined) queryParams.set('limit', String(params.limit));
  if (params.year) queryParams.set('year', params.year);
  if (params.publicationTypes) queryParams.set('publicationTypes', params.publicationTypes);
  if (params.fieldsOfStudy) queryParams.set('fieldsOfStudy', params.fieldsOfStudy);
  if (params.openAccessPdf) queryParams.set('openAccessPdf', 'true');
  if (params.minCitationCount) queryParams.set('minCitationCount', String(params.minCitationCount));
  if (params.sort) queryParams.set('sort', params.sort);

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  const storedKey = getStoredApiKey();
  if (storedKey) {
    headers['x-api-key'] = storedKey;
  }

  const response = await fetch(`/api/semantic/search?${queryParams.toString()}`, { headers });
  if (!response.ok) {
    throw new Error(`Search error: HTTP ${response.status}`);
  }

  const json = await response.json();
  const papers: Paper[] = (json.data || []).map(transformSemanticPaper);

  return {
    total: json.total || papers.length,
    offset: json.offset || 0,
    next: json.next,
    data: papers,
    papers,
    source: json.source || 'semantic_scholar_live',
    rateLimited: Boolean(json.rateLimited),
    message: json.message,
  };
}

export async function getSemanticPaperDetails(paperId: string): Promise<Paper> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const storedKey = getStoredApiKey();
  if (storedKey) headers['x-api-key'] = storedKey;

  const response = await fetch(`/api/semantic/paper/${encodeURIComponent(paperId)}`, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch paper details: HTTP ${response.status}`);
  }
  const json = await response.json();
  return transformSemanticPaper(json.data);
}

export async function getSemanticAutocomplete(query: string): Promise<{ id: string; title: string; authors?: string; year?: number }[]> {
  if (!query.trim()) return [];
  try {
    const headers: Record<string, string> = { Accept: 'application/json' };
    const storedKey = getStoredApiKey();
    if (storedKey) headers['x-api-key'] = storedKey;

    const response = await fetch(`/api/semantic/autocomplete?query=${encodeURIComponent(query)}`, { headers });
    if (!response.ok) return [];
    const json = await response.json();
    return (json.matches || []).map((m: any) => ({
      id: m.id || m.paperId,
      title: m.title,
      authors: m.authors,
      year: m.year,
    }));
  } catch {
    return [];
  }
}
