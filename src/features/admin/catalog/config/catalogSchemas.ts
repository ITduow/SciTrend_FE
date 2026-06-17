export const catalogSchemas: Record<string, unknown> = {
  publishers: { name: "", country: "" },
  journals: { title: "", issn: "", publisherId: "", subjectAreaId: "" },
  issues: { journalId: "", publicationYear: new Date().getFullYear() },
  articles: { title: "", issueId: "", abstract: "", publicationYear: new Date().getFullYear() },
  authors: { firstName: "", lastName: "", email: "" },
  keywords: { word: "" },
  "subject-areas": { code: "", name: "" }
};
