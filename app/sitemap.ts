import type { MetadataRoute } from "next";
import { projects } from "@/data/portfolio";
import { repositories, repositoryPath } from "@/data/repositories";
import { siteUrl } from "@/data/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/work/",
    ...projects.map((p) => "/work/" + p.slug + "/"),
    ...repositories.filter((r) => !r.caseStudy).map(repositoryPath),
  ];
  return paths.map((path) => ({
    url: siteUrl + path,
  }));
}
