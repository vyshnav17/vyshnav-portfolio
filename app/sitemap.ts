import type { MetadataRoute } from "next";
import { projects } from "@/data/portfolio";
import { siteUrl } from "@/data/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...projects.map((p) => "/work/" + p.slug + "/")].map((path) => ({
    url: siteUrl + path,
  }));
}
