import { ArrowLeft, Github, ArrowUpRight } from "lucide-react";
import { RepositoryCatalog } from "@/components/RepositoryCatalog";
import {getContent} from "@/lib/content";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function generateMetadata(){const {site}=await getContent();return {title:site.archiveTitle,description:site.description,alternates:{canonical:"/work/"}}}
export default async function Archive() { const {profile,site,repositories,sections}=await getContent();
  return (
    <main id="main" className="container case archive">
      <a className="back" href="/#work">
        <ArrowLeft size={16} /> Selected work
      </a>
      <header className="case-head">
        <div className="section-label">
          <span />
          {sections.work.label}
        </div>
        <h1>
          {site.archiveTitle}<em>.</em>
        </h1>
        <div className="archive-byline">
          <span>{repositories.length} public repositories</span>
          <a
            href={profile.github + "?tab=repositories"}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={15} />
            @{new URL(profile.github).pathname.split("/").filter(Boolean).pop()} <ArrowUpRight size={13} />
          </a>
        </div>
      </header>
      <RepositoryCatalog repositories={repositories}/>
    </main>
  );
}
