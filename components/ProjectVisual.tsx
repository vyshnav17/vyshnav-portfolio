import Image from "next/image";
import type { Project } from "@/data/portfolio";
export const screens: Record<
  string,
  { image: string; host: string; alt: string }
> = {
  travox: {
    image: "/work/travox.webp",
    host: "travox-rho.vercel.app",
    alt: "Actual Travox homepage with a touring vehicle and travel planning options",
  },
  "hospital-system": {
    image: "/work/hospital.webp",
    host: "ai-based-govt-hospital-smart-queue.vercel.app",
    alt: "Actual SmartCare AI hospital platform homepage",
  },
  "personalised-learning": {
    image: "/work/lms.webp",
    host: "ai-personalised-lms.vercel.app",
    alt: "Actual AI-Personalised LMS welcome screen with login and registration",
  },
};
export function ProjectVisual({ project }: { project: Project }) {
  const s = screens[project.slug];
  return (
    <div className={"project-visual visual-" + project.slug}>
      <div className="browser">
        <div className="browser-bar">
          <i />
          <i />
          <i />
          <span>{s.host}</span>
        </div>
        <Image
          width={1440}
          height={900}
          sizes="(max-width: 760px) 90vw, 58vw"
          src={s.image}
          alt={s.alt}
        />
      </div>
    </div>
  );
}
