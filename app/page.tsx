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
import { projects, profile, stack, certificates } from "@/data/portfolio";
import { siteUrl } from "@/data/site";
import { HeroVisual } from "@/components/HeroVisual";
import { repositories } from "@/data/repositories";
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
export default function Home() {
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
            image: siteUrl + "/vyshnav-portrait-880.webp",
            jobTitle: "Aspiring Software Developer",
            sameAs: [profile.github, profile.linkedin],
            affiliation: {
              "@type": "EducationalOrganization",
              name: "Srinivas University",
            },
            knowsAbout: [
              "Full-stack development",
              "Applied AI",
              "Machine learning",
            ],
          }),
        }}
      />
      <section aria-labelledby="intro-title" className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="intro">
              <div className="available">
                <i />
                Open to software engineering opportunities
              </div>
              <h1 id="intro-title">
                Vyshnav T V<span>.</span>
              </h1>
              <div className="role">
                <span>Software Developer</span>
                <i />
                Full-Stack &amp; Applied AI
              </div>
              <h2 className="statement">
                Turning complex problems into
                <br className="desktop-break" /> thoughtful digital solutions.
              </h2>
              <p className="intro-body">
                I’m a Computer Science Engineering student building full-stack
                applications and AI-powered solutions that solve practical
                problems.
              </p>
              <div className="hero-actions">
                <Magnetic>
                  <a href="#work" className="btn primary">
                    Explore my work <ArrowDownRight size={17} />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a className="btn secondary" href={profile.resume} download>
                    <Download size={15} />
                    Download resume
                  </a>
                </Magnetic>
              </div>
              <div className="hero-meta">
                <span>
                  <MapPin size={14} /> Kannur, Kerala, India
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
            <HeroVisual />
          </div>
          <div className="hero-foot">
            <a className="scroll-link" href="#work">
              <ArrowDown size={14} />
              Scroll to explore
            </a>
            <div className="ticks" aria-hidden="true" />
          </div>
        </div>
      </section>
      <section className="section container" id="work">
        <Label>Project index</Label>
        <div className="section-title-row">
          <h2>
            Selected work<span>.</span>
          </h2>
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
                      {i === 0 ? p.title : p.short}
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
            <Github size={20} /> GitHub project archive
          </span>
          <span>
            {repositories.length} repositories <ArrowUpRight size={17} />
          </span>
        </a>
      </section>
      <section id="about" className="section container ruled">
        <Label>About</Label>
        <div className="section-title-row">
          <h2>
            Behind the work<span>.</span>
          </h2>
        </div>
        <div className="about-grid">
          <p className="about-lead">
            I’m Vyshnav, a Computer Science Engineering student interested in
            what makes useful software work.
          </p>
          <div className="about-copy">
            <p>
              At Srinivas University, I’m studying the foundations of computer
              science while building full-stack applications and exploring
              applied AI. I enjoy turning a practical problem into a working
              system, from its database to the interface people use.
            </p>
            <p>
              Freelance work, internships, and academic projects have given me a
              place to put that learning into practice. I’m looking for software
              engineering opportunities where I can keep building and learning.
            </p>
            <div className="about-facts">
              <span>
                <GraduationCap size={16} /> Srinivas University
              </span>
              <span>
                <MapPin size={16} /> Kannur, Kerala
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section container ruled" id="experience">
        <Label>Experience</Label>
        <div className="section-title-row">
          <h2>
            Field experience<span>.</span>
          </h2>
        </div>
        <Timeline />
      </section>
      <section id="stack" className="section container ruled">
        <Label>Tech stack</Label>
        <div className="section-title-row">
          <h2>
            Tools of the trade<span>.</span>
          </h2>
        </div>
        <div className="stack-grid">
          {stack.map(([cat, items], i) => {
            const Icon = categoryIcons[i];
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
      </section>
      <section id="education" className="section container ruled">
        <Label>Education &amp; certifications</Label>
        <div className="section-title-row">
          <h2>
            Learning foundations<span>.</span>
          </h2>
        </div>
        <div className="edu-grid">
          <div>
            <GraduationCap />
            <span className="mono">SEP 2023 — PRESENT</span>
            <h3>B.Tech in Computer Science Engineering</h3>
            <p>Srinivas University · Mangaluru, Karnataka</p>
          </div>
          <div>
            <Globe />
            <span className="mono">OCT 2023 — PRESENT</span>
            <h3>CCBP 4.0 Full-Stack Development Program</h3>
            <p>NxtWave CCBP 4.0 Academy · Remote</p>
          </div>
        </div>
        <h3 className="cert-title">Certifications</h3>
        <div className="cert-grid">
          {certificates.map(([issuer, cert]) => (
            <article key={cert}>
              <Award size={19} />
              <div>
                <small>{issuer}</small>
                <h4>{cert}</h4>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="contact" className="contact">
        <div className="container">
          <Label>Get in touch</Label>
          <h2>
            Have something interesting
            <br /> in mind? <span>Let’s build it.</span>
          </h2>
          <div className="contact-email">
            <Mail size={19} />
            <a href={"mailto:" + profile.email}>{profile.email}</a>
            <CopyEmail />
          </div>
          <div className="contact-links">
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Github size={16} /> GitHub <ArrowUpRight size={13} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} />
            </a>
            <a href={profile.resume} download>
              <Download size={15} /> Download resume
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
