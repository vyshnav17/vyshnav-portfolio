import Image from "next/image";
import type {Project} from "@/data/schema";
export function ProjectVisual({ project }: { project: Project }) {
  if(!project.image)return <div className="project-visual">{project.short}</div>;
  return (
    <div className={"project-visual visual-" + project.slug}>
      <div className="browser">
        <div className="browser-bar">
          <i />
          <i />
          <i />
          <span>{project.caption}</span>
        </div>
        <Image
          width={1440}
          height={900}
          sizes="(max-width: 760px) 90vw, 58vw"
          src={project.image}
          alt={project.imageAlt}
        />
      </div>
    </div>
  );
}
