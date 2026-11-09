"use client";
import { useState, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, Minus, Plus } from "lucide-react";
import { experience } from "@/data/portfolio";
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
export function Timeline() {
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
const roles = [
  [
    "Patient",
    "Intake & access",
    "Enter symptoms, follow the queue, and access chatbot or telehealth support.",
  ],
  [
    "Doctor",
    "Clinical assessment",
    "Review triage information and predictive model outputs during assessment.",
  ],
  [
    "Nurse",
    "Queue & beds",
    "Coordinate the patient queue and keep bed availability up to date.",
  ],
  [
    "Administrator",
    "Resource allocation",
    "Oversee the queue and available resources across the hospital.",
  ],
];
const modules = [
  ["Symptom intake", "Queue status", "Telehealth"],
  ["Triage review", "Predictive models", "Patient queue"],
  ["Queue routing", "Bed availability"],
  ["Resource allocation", "Bed tracking", "Queue oversight"],
];
const steps = [
  ["Course activity", "A learner signs in and works through course material."],
  [
    "Progress tracking",
    "Learning activity becomes input for ML-based progress tracking.",
  ],
  [
    "Recommended content",
    "The system uses behaviour and progress to suggest what to study next.",
  ],
];
export function Walkthrough({ health }: { health: boolean }) {
  const [i, setI] = useState(0);
  return (
    <div className="walkthrough">
      <div className="mono lime">
        {health
          ? "ROLE DASHBOARDS / INTERACTIVE CONCEPT"
          : "ILLUSTRATIVE LEARNING PATH"}
      </div>
      <div className="choices">
        {(health ? roles : steps).map((v, j) => (
          <button key={v[0]} aria-pressed={i === j} onClick={() => setI(j)}>
            {v[0]}
          </button>
        ))}
      </div>
      <div className="walk-content" aria-live="polite">
        <ArrowDownRight />
        <div>
          <h3>{health ? roles[i][1] : steps[i][0]}</h3>
          <p>{health ? roles[i][2] : steps[i][1]}</p>
        </div>
      </div>
      {health && (
        <div className="module-tools" aria-label={roles[i][0] + " modules"}>
          {modules[i].map((name) => (
            <span key={name}>
              <span aria-hidden="true">◇</span>
              {name}
            </span>
          ))}
        </div>
      )}
      {!health && (
        <div className="step-line" aria-label={"Step " + (i + 1) + " of 3"}>
          {steps.map((_, j) => (
            <i className={j <= i ? "on" : ""} key={j} />
          ))}
        </div>
      )}
    </div>
  );
}
