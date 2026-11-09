import type { MetadataRoute } from "next";
import {getContent} from "@/lib/content";
import { repositoryPath } from "@/data/repositories";
import { siteUrl } from "@/data/site";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const {projects,repositories}=await getContent();
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
