import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ArrowRight, Check } from "lucide-react";
import { projects } from "@/data/portfolio";
import { ProjectVisual, screens } from "@/components/ProjectVisual";
import { Walkthrough } from "@/components/Interactive";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  const project = projects.find((x) => x.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: "/work/" + slug + "/" },
    openGraph: {
      title: project.title,
      description: project.description,
      images: [screens[slug].image],
    },
  };
}
export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = projects[i],
    next = projects[(i + 1) % projects.length];
  return (
    <main id="main" className="container case">
      <a href="/#work" className="back">
        <ArrowLeft size={15} /> Selected work
      </a>
      <div className="case-head">
        <div className="section-label">
          <span />
          Case study 0{i + 1} / {p.category}
        </div>
        <h1>
          {p.title}
          <em>.</em>
        </h1>
        <p className="case-intro">{p.description}</p>
        <div className="case-meta">
          <span className="mono">{p.period}</span>
          <a
            href={p.link}
            className="btn primary"
            target="_blank"
            rel="noreferrer"
          >
            {p.linkName}
            <ArrowUpRight size={15} />
          </a>
          {i > 0 && (
            <a
              href={"https://" + screens[slug].host}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Live site <ArrowUpRight size={15} />
            </a>
          )}
        </div>
      </div>
      <figure>
        <ProjectVisual project={p} />
        <figcaption>Product screenshot · {screens[slug].host}</figcaption>
      </figure>
      <div className="case-columns">
        <aside>
          <p className="mono">IN THIS CASE STUDY</p>
          {["Overview", "Implementation", "Features", "Technologies"].map(
            (t) => (
              <a key={t} href={"#" + t.toLowerCase()}>
                {t}
              </a>
            ),
          )}
        </aside>
        <div className="case-body">
          <section id="overview">
            <h2>Overview</h2>
            <h3>The problem</h3>
            <p>{p.problem}</p>
            <h3>The solution</h3>
            <p>{p.solution}</p>
          </section>
          <section id="implementation">
            <h2>Implementation</h2>
            <ol>
              {p.implementation.map(([title, body]) => (
                <li key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
            {i !== 0 ? (
              <Walkthrough health={i === 1} />
            ) : (
              <figure className="builder">
                <Image
                  width={1440}
                  height={900}
                  src="/work/travox-builder.webp"
                  alt="Travox six-step custom trip builder with preferences and estimate"
                  sizes="(max-width:760px) 90vw, 60vw"
                />
                <figcaption>
                  Product screenshot · Custom trip builder
                </figcaption>
              </figure>
            )}
          </section>
          <section id="features">
            <h2>Key features</h2>
            <ul className="features">
              {p.features.map((f) => (
                <li key={f}>
                  <Check size={16} />
                  {f}
                </li>
              ))}
            </ul>
          </section>
          <section id="technologies">
            <h2>Technologies</h2>
            <div className="chips">
              {p.tech.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
      <a href={"/work/" + next.slug + "/"} className="next-case">
        <div>
          <span className="mono">NEXT CASE STUDY</span>
          <h2>{next.short}</h2>
        </div>
        <ArrowRight size={30} />
      </a>
    </main>
  );
}
