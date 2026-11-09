import { ArrowLeft, Github, ArrowUpRight } from "lucide-react";
import { RepositoryCatalog } from "@/components/RepositoryCatalog";
import { profile } from "@/data/portfolio";
import { repositories } from "@/data/repositories";

export const metadata = {
  title: "GitHub project archive",
  description:
    "Browse Vyshnav T V’s public GitHub repositories, source code, and case studies.",
  alternates: { canonical: "/work/" },
};
export default function Archive() {
  return (
    <main id="main" className="container case archive">
      <a className="back" href="/#work">
        <ArrowLeft size={16} /> Selected work
      </a>
      <header className="case-head">
        <div className="section-label">
          <span />
          Project index
        </div>
        <h1>
          GitHub projects<em>.</em>
        </h1>
        <div className="archive-byline">
          <span>{repositories.length} public repositories</span>
          <a
            href={profile.github + "?tab=repositories"}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={15} />
            @vyshnav17 <ArrowUpRight size={13} />
          </a>
        </div>
      </header>
      <RepositoryCatalog />
    </main>
  );
}
