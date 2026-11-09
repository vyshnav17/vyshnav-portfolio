"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Box, RotateCcw, Move } from "lucide-react";

import { projectKnot } from "./knot";
export default function Sculpture() {
  const [angle, setAngle] = useState([-0.25, 0.52]),
    [signal, setSignal] = useState(false);
  const drag = useRef<{ x: number; y: number; a: number[] } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [interacted, setInteracted] = useState(false);
  useEffect(() => {
    if (!interacted) return;
    const frame = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(500, Math.ceil(canvas.clientWidth * ratio));
      canvas.width = width;
      canvas.height = Math.round((width * 410) / 500);
      ctx.scale(width / 500, width / 500);
      ctx.lineWidth = 0.72;
      ctx.fillStyle = "#0e1911";
      for (const face of projectKnot(angle[0], angle[1])) {
        ctx.beginPath();
        face.points.forEach(([x, y], i) =>
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y),
        );
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = face.stroke;
        ctx.stroke();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [angle, interacted]);
  function start(e: PointerEvent<HTMLDivElement>) {
    drag.current = { x: e.clientX, y: e.clientY, a: angle };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (d) {
      setInteracted(true);
      setAngle([
        d.a[0] + (e.clientX - d.x) * 0.008,
        d.a[1] + (e.clientY - d.y) * 0.008,
      ]);
    }
  }
  return (
    <figure
      onPointerMove={(e) => {
        if (
          e.pointerType !== "mouse" ||
          matchMedia("(prefers-reduced-motion:reduce)").matches
        )
          return;
        const bounds = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--node-x",
          ((e.clientX - bounds.left) / bounds.width) * 100 + "%",
        );
        e.currentTarget.style.setProperty(
          "--node-y",
          ((e.clientY - bounds.top) / bounds.height) * 100 + "%",
        );
      }}
      className={"sculpture " + (signal ? "signal-on" : "")}
    >
      <div className="plot-nodes" aria-hidden="true" />
      <div className="plot-label">
        <i /> FIG. 01 <span>/</span> GENERATIVE FORM
      </div>
      <div
        className="plot-area"
        role="group"
        aria-label="Torus knot sculpture. Drag or use the arrow keys to rotate. Press Enter to toggle signal mode."
        tabIndex={0}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={(e) => {
          const v = 0.15;
          if (e.key.startsWith("Arrow")) {
            e.preventDefault();
            setInteracted(true);
            setAngle((a) => [
              a[0] +
                (e.key === "ArrowRight" ? v : e.key === "ArrowLeft" ? -v : 0),
              a[1] + (e.key === "ArrowDown" ? v : e.key === "ArrowUp" ? -v : 0),
            ]);
          }
          if (e.key === "Enter") setSignal((s) => !s);
        }}
      >
        <div className="knot-frame">
          <img
            className="knot"
            src="/torus.webp"
            fetchPriority="high"
            width="1000"
            height="820"
            alt="Interlaced electric-lime wireframe torus knot"
            style={{ visibility: interacted ? "hidden" : "visible" }}
          />
          {interacted && (
            <canvas
              className="knot knot-canvas"
              ref={canvasRef}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
      <div className="plot-caption">
        <span>
          <Box size={13} /> TORUS KNOT <b>/</b> p:2 q:3
        </span>
        <button
          title="Reset rotation"
          aria-label="Reset sculpture rotation"
          onClick={() => {
            setAngle([-0.25, 0.52]);
            setSignal(false);
            setInteracted(false);
          }}
        >
          <RotateCcw size={13} />
        </button>
      </div>
      <div className="rotate-hint">
        <Move size={11} /> Drag to rotate
      </div>
      <button
        className="signal"
        title="Toggle signal mode"
        aria-label="Toggle sculpture signal mode"
        aria-pressed={signal}
        onClick={() => setSignal((s) => !s)}
      >
        <span />
        {signal ? "SIGNAL LOCKED" : "LIVE RENDER"}
      </button>
    </figure>
  );
}
