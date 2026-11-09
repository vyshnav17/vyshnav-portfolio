import {
  ArrowUpRight,
  ArrowDown,
  ArrowDownRight,
  Download,
  MapPin,
  Github,
  Linkedin,
  Mail,
  Braces,
  Layers3,
  Server,
  Database,
  Network,
  Terminal,
  GraduationCap,
  Award,
  Code2,
  Globe,
} from "lucide-react";
import {getContent} from "@/lib/content";
export const dynamic="force-dynamic";
import { siteUrl } from "@/data/site";
import { HeroVisual } from "@/components/HeroVisual";

import { ProjectVisual } from "@/components/ProjectVisual";
import { Reveal, Timeline, Magnetic } from "@/components/Interactive";
import { CopyEmail } from "@/components/Chrome";
export const metadata = { alternates: { canonical: "/" } };
const techIcon: Record<string, string> = {
  Java: "java",
  Python: "python",
  "C++": "cpp",
  JavaScript: "javascript",
  "React.js": "react",
  "Next.js": "nextjs",
  "Tailwind CSS": "tailwind",
  HTML: "html",
  CSS: "css",
  "Node.js": "node",
  Django: "django",
  MongoDB: "mongodb",
  SQL: "sql",
  Firebase: "firebase",
  Prisma: "prisma",
  "Scikit-learn": "scikit",
  Pandas: "pandas",
  NumPy: "numpy",
  Git: "git",
  Linux: "linux",
};
const categoryIcons = [Braces, Layers3, Server, Database, Network, Terminal];
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span />
      {children}
    </div>
  );
}
export default async function Home() {
 const {profile,about,projects,repositories,experience,stack,education,certificates,sections,contact,site}=await getContent();
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            url: siteUrl,
            image: profile.portrait ? new URL(profile.portrait,siteUrl).href : undefined,
            jobTitle: profile.role,
            sameAs: [profile.github, profile.linkedin],
            affiliation: {
              "@type": "EducationalOrganization",
              name: about.university,
            },
            knowsAbout: [
              "Full-stack development",
              "Applied AI",
              "Machine learning",
            ],
          }).replace(/</g,"\\u003c"),
        }}
      />
      <section aria-labelledby="intro-title" className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="intro">
              <div className="available">
                <i />
                {profile.status}
              </div>
              <h1 id="intro-title">
                {profile.name}<span>.</span>
              </h1>
              <div className="role">
                <span>{profile.role}</span>
                <i />
                {profile.specialty}
              </div>
              <h2 className="statement" style={{whiteSpace:"pre-line"}}>{profile.headline}</h2>
              <p className="intro-body">{profile.introduction}</p>
              <div className="hero-actions">
                <Magnetic>
                  <a href={sections.work.visible?"#work":"/work/"} className="btn primary">
                    {profile.workButton} <ArrowDownRight size={17} />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a className="btn secondary" href={profile.resume} download>
                    <Download size={15} />
                    {profile.resumeButton}
                  </a>
                </Magnetic>
              </div>
              <div className="hero-meta">
                <span>
                  <MapPin size={14} /> {profile.location}
                </span>
                <i />
                <a href={profile.github} target="_blank" rel="noreferrer">
                  <Github size={15} />
                  GitHub
                  <ArrowUpRight size={11} />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={14} />
                  LinkedIn
                  <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
            <HeroVisual portrait={profile.portrait} alt={profile.portraitAlt}/>
          </div>
          <div className="hero-foot">
            <a className="scroll-link" href={sections.work.visible?"#work":"/work/"}>
              <ArrowDown size={14} />
              Scroll to explore
            </a>
            <div className="ticks" aria-hidden="true" />
          </div>
        </div>
      </section>
      {sections.work.visible && (<section className="section container" id="work">
        <Label>{sections.work.label}</Label>
        <div className="section-title-row">
          <h2>{sections.work.heading}<span>.</span></h2>
          <a className="text-link archive-link" href="/work/">
            All GitHub projects ({repositories.length}){" "}
            <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="projects">
          {projects.map((p, i) => (
            <Reveal key={p.slug}>
              <article className="project">
                <a
                  href={"/work/" + p.slug + "/"}
                  className="project-image-link"
                  aria-label={"Open " + p.short + " case study"}
                >
                  <ProjectVisual project={p} />
                </a>
                <div className="project-info">
                  <div className="project-kicker">
                    <span>0{i + 1}</span>
                    <i />
                    {p.category}
                  </div>
                  <h3>
                    <a href={"/work/" + p.slug + "/"}>
                      {p.short || p.title}
                    </a>
                  </h3>
                  <p>{p.description}</p>
                  <div className="chips">
                    {p.tech.slice(0, 4).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <a className="text-link" href={"/work/" + p.slug + "/"}>
                    Read case study <ArrowUpRight size={17} />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <a className="archive-strip" href="/work/">
          <span>
            <Github size={20} /> {site.archiveLabel}
          </span>
          <span>
            {repositories.length} repositories <ArrowUpRight size={17} />
          </span>
        </a>
      </section>)}
      {sections.about.visible && (<section id="about" className="section container ruled">
        <Label>{sections.about.label}</Label>
        <div className="section-title-row">
          <h2>{sections.about.heading}<span>.</span></h2>
        </div>
        <div className="about-grid">
          <p className="about-lead">{about.introduction}</p>
          <div className="about-copy">{about.paragraphs.map((p,i)=><p key={i}>{p}</p>)}<div className="about-facts">
              <span>
                <GraduationCap size={16} /> {about.university}
              </span>
              <span>
                <MapPin size={16} /> {about.location}
              </span>
            </div>
          </div>
        </div>
      </section>)}
      {sections.experience.visible && (<section className="section container ruled" id="experience">
        <Label>{sections.experience.label}</Label>
        <div className="section-title-row">
          <h2>{sections.experience.heading}<span>.</span></h2>
        </div>
        <Timeline experience={experience}/>
      </section>)}
      {sections.stack.visible && (<section id="stack" className="section container ruled">
        <Label>{sections.stack.label}</Label>
        <div className="section-title-row">
          <h2>{sections.stack.heading}<span>.</span></h2>
        </div>
        <div className="stack-grid">
          {stack.map(({title:cat,technologies:items}, i) => {
            const Icon = categoryIcons[i%categoryIcons.length];
            return (
              <div className="stack-card" key={cat}>
                <Icon size={22} />
                <h3>{cat}</h3>
                <div className="tech-list">
                  {items.map((t) => (
                    <span key={t}>
                      {techIcon[t] ? (
                        <img
                          loading="lazy"
                          width={16}
                          height={16}
                          src={"/tech/" + techIcon[t] + ".svg"}
                          alt=""
                        />
                      ) : (
                        <Code2 size={16} />
                      )}
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>)}
      {sections.education.visible && (<section id="education" className="section container ruled">
        <Label>{sections.education.label}</Label>
        <div className="section-title-row">
          <h2>{sections.education.heading}<span>.</span></h2>
        </div>
        <div className="edu-grid">{education.map((e,i)=><div key={i}>{i===0?<GraduationCap/>:<Globe/>}<span className="mono">{e.period}</span><h3>{e.title}</h3><p>{e.institution}</p></div>)}</div><h3 className="cert-title">Certifications</h3>
        <div className="cert-grid">
          {certificates.map(({issuer,title:cert}) => (
            <article key={cert}>
              <Award size={19} />
              <div>
                <small>{issuer}</small>
                <h4>{cert}</h4>
              </div>
            </article>
          ))}
        </div>
      </section>)}
      {sections.contact.visible && (<section id="contact" className="contact">
        <div className="container">
          <Label>{sections.contact.label}</Label>
          <h2>
            {contact.heading} <span>{contact.highlight}</span>
          </h2>
          <div className="contact-email">
            <Mail size={19} />
            <a href={"mailto:" + profile.email}>{profile.email}</a>
            <CopyEmail email={profile.email}/>
          </div>
          <div className="contact-links">
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Github size={16} /> GitHub <ArrowUpRight size={13} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} />
            </a>
            <a href={profile.resume} download>
              <Download size={15} /> {profile.resumeButton}
            </a>
          </div>
        </div>
      </section>)}
    </main>
  );
}
