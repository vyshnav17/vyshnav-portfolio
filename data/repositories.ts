import type {Repository} from "./schema";
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
