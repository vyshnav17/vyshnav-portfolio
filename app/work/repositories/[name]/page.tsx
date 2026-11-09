import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  GitFork,
  Folder,
  FileText,
  Github,
} from "lucide-react";
import { repositories, repositoryPath, repoLabels } from "@/data/repositories";

const entries = repositories.filter((r) => !r.caseStudy);
export function generateStaticParams() {
  return entries.map((r) => ({ name: r.name.toLowerCase() }));
}
type Props = { params: Promise<{ name: string }> };
async function getRepository(params: Props["params"]) {
  const { name } = await params;
  const repo = entries.find((r) => r.name.toLowerCase() === name);
  if (!repo) notFound();
  return repo;
}
export async function generateMetadata({ params }: Props) {
  const r = await getRepository(params);
  return {
    title: r.title,
    description: r.summary,
    alternates: { canonical: repositoryPath(r) },
    openGraph: {
      title: r.title,
      description: r.summary,
      images: [r.screenshot || "/social-card.png"],
    },
  };
}
export default async function RepositoryPage({ params }: Props) {
  const r = await getRepository(params);
  return (
    <main id="main" className="container case repo-detail">
      <a className="back" href="/work/">
        <ArrowLeft size={15} /> GitHub project archive
      </a>
      <header className="case-head">
        <div className="section-label">
          <span />
          {r.category}
        </div>
        <h1>
          {r.title}
          <em>.</em>
        </h1>
        <p className="case-intro">{r.summary}</p>
        <div className="case-meta">
          <a
            className="btn primary"
            href={r.url}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={15} />
            View repository
            <ArrowUpRight size={14} />
          </a>
          {r.live && (
            <a
              className="text-link"
              href={r.live}
              target="_blank"
              rel="noreferrer"
            >
              Visit live site <ArrowUpRight size={15} />
            </a>
          )}
        </div>
      </header>
      {r.screenshot && (
        <figure className="repo-shot">
          <img
            src={r.screenshot}
            width={1200}
            height={750}
            alt={r.title + " live website homepage"}
          />
          <figcaption>
            Product screenshot · {r.live && new URL(r.live).hostname}
          </figcaption>
        </figure>
      )}
      <section className="repo-facts">
        <h2>Repository details</h2>
        <dl>
          <div>
            <dt>Repository</dt>
            <dd>{r.name}</dd>
          </div>
          <div>
            <dt>Published contents</dt>
            <dd>{repoLabels[r.status]}</dd>
          </div>
          {r.language && (
            <div>
              <dt>Primary language on GitHub</dt>
              <dd>{r.language}</dd>
            </div>
          )}
          {r.upstream && (
            <div>
              <dt>
                <GitFork size={14} /> Forked from
              </dt>
              <dd>
                <a href={r.upstream} target="_blank" rel="noreferrer">
                  {new URL(r.upstream).pathname.slice(1)}{" "}
                  <ArrowUpRight size={13} />
                </a>
              </dd>
            </div>
          )}
        </dl>
      </section>
      {r.files.length > 0 && (
        <section className="repo-files">
          <h2>Explore the source</h2>
          <ul>
            {r.files.map((f) => (
              <li key={f.name}>
                <a href={f.url} target="_blank" rel="noreferrer">
                  {f.type === "dir" ? (
                    <Folder size={16} />
                  ) : (
                    <FileText size={16} />
                  )}
                  <span>{f.name}</span>
                  <ArrowUpRight size={14} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
