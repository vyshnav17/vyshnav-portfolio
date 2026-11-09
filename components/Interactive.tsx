"use client";
import { useState, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, Minus, Plus } from "lucide-react";
import type {Content, Project} from "@/data/schema";
export function Reveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={false}
      whileInView={reduced ? {} : { y: [10, 0] }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45 }}
    >
      {children}
    </motion.div>
  );
}
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      className="magnetic"
      ref={ref}
      onPointerMove={(e) => {
        if (
          e.pointerType !== "mouse" ||
          matchMedia("(prefers-reduced-motion:reduce)").matches
        )
          return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.transform =
          "translate(" +
          (e.clientX - r.left - r.width / 2) * 0.06 +
          "px," +
          (e.clientY - r.top - r.height / 2) * 0.08 +
          "px)";
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </span>
  );
}
export function Timeline({experience}:{experience:Content["experience"]}) {
  return (
    <div className="timeline">
      {experience.map((e, i) => (
        <details key={e.role} open={i === 0}>
          <summary>
            <span className="when">{e.date}</span>
            <span className="position">
              <strong>{e.role}</strong>
              <small>{e.org}</small>
            </span>
            <span className="expand">
              <Plus size={17} />
              <Minus size={17} />
            </span>
          </summary>
          <div className="timeline-body">
            <span className="mono">
              {e.type} · {e.place}
            </span>
            <p>{e.body}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
export function Walkthrough({project}:{project:Project}){
 const [i,setI]=useState(0),item=project.guide[i];
 if(!item)return null;
 return <div className="walkthrough"><div className="mono lime">{project.guideTitle}</div><div className="choices">{project.guide.map((g,j)=><button key={j} aria-pressed={i===j} onClick={()=>setI(j)}>{g.label}</button>)}</div><div className="walk-content" aria-live="polite"><ArrowDownRight/><div><h3>{item.title}</h3><p>{item.body}</p></div></div>{item.modules.length>0&&<div className="module-tools">{item.modules.map((m,j)=><span key={j}>◇ {m}</span>)}</div>}{project.progressGuide&&<div className="step-line">{project.guide.map((_,j)=><i key={j} className={j<=i?"on":""}/>)}</div>}</div>
}
