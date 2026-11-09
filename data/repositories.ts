import data from "./github-projects.json";
export type Repository = {
  name: string;
  title: string;
  category: string;
  summary: string;
  url: string;
  language: string | null;
  status: string;
  upstream?: string;
  live?: string;
  caseStudy?: string;
  screenshot?: string;
  files: { name: string; type: string; url: string }[];
};
export const repositories: Repository[] = data;
export const repoLabels: Record<string, string> = {
  source: "Source code",
  readme: "README only",
  empty: "Empty repository",
};
export function repositoryPath(repo: Repository) {
  return (
    repo.caseStudy || "/work/repositories/" + repo.name.toLowerCase() + "/"
  );
}
