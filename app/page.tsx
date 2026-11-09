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
  Instagram,
} from "lucide-react";
import {getContent} from "@/lib/content";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { siteUrl } from "@/data/site";
import { HeroVisual } from "@/components/HeroVisual";

import { ProjectVisual } from "@/components/ProjectVisual";
import { Reveal, Timeline, Magnetic } from "@/components/Interactive";
import { CopyEmail } from "@/components/Chrome";
import { ContactForm } from "@/components/ContactForm";

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.414z" />
    </svg>
  );
}
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
                {profile.instagram && (
                  <a href={profile.instagram} target="_blank" rel="noreferrer">
                    <Instagram size={14} />
                    Instagram
                    <ArrowUpRight size={11} />
                  </a>
                )}
                {profile.whatsapp && (
                  <a
                    href={`https://wa.me/${(profile.whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent(
                      contact.whatsappMessage || "Hi Vyshnav, I came across your portfolio!"
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <WhatsAppIcon size={14} />
                    WhatsApp
                    <ArrowUpRight size={11} />
                  </a>
                )}
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
      {sections.contact.visible && (
        <section id="contact" className="contact">
          <div className="container">
            <Label>{sections.contact.label}</Label>
            <h2>
              {contact.heading} <span>{contact.highlight}</span>
            </h2>
            <p className="contact-desc">
              {contact.description ||
                "Have a question, opportunity, or project in mind? Reach out via the form below, WhatsApp, or Instagram."}
            </p>

            <div className="contact-layout">
              <div>
                <div className="contact-cards-group">
                  <a
                    href={`https://wa.me/${(contact.whatsapp || profile.whatsapp || "919995329387").replace(/\D/g, "")}?text=${encodeURIComponent(
                      contact.whatsappMessage || "Hi Vyshnav, I came across your portfolio and would like to connect!"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-card whatsapp"
                  >
                    <div className="card-icon whatsapp-icon">
                      <WhatsAppIcon size={22} />
                    </div>
                    <div className="card-text">
                      <small>WhatsApp Direct</small>
                      <strong>{contact.whatsapp || profile.whatsapp || "+91 99953 29387"}</strong>
                    </div>
                    <ArrowUpRight size={18} className="card-arrow" />
                  </a>

                  <a
                    href={contact.instagram || profile.instagram || "https://www.instagram.com/vyshnav.tv/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-card instagram"
                  >
                    <div className="card-icon instagram-icon">
                      <Instagram size={22} />
                    </div>
                    <div className="card-text">
                      <small>Instagram Profile</small>
                      <strong>@vyshnav.tv</strong>
                    </div>
                    <ArrowUpRight size={18} className="card-arrow" />
                  </a>

                  <div className="contact-card">
                    <div className="card-icon email-icon">
                      <Mail size={22} />
                    </div>
                    <div className="card-text">
                      <small>Direct Email</small>
                      <a href={"mailto:" + profile.email} className="email-link">
                        {profile.email}
                      </a>
                    </div>
                    <CopyEmail email={profile.email} />
                  </div>
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

              <div>
                <ContactForm ownerEmail={profile.email} />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
