"use client";

import { useState } from "react";
import { Box, UserRound } from "lucide-react";
import Sculpture from "./Sculpture";

export function HeroVisual({portrait,alt}:{portrait:string;alt:string}) {
  const [wireframe, setWireframe] = useState(false);
  return (
    <div className="hero-visual">
      <div className="hero-visual-stage" id="hero-visual-stage">
        {wireframe || !portrait ? (
          <Sculpture />
        ) : (
          <figure className="portrait">
            <img
              src={portrait}
              srcSet={portrait==="/vyshnav-portrait-880.webp"?"/vyshnav-portrait-480.webp 480w, /vyshnav-portrait-880.webp 880w":undefined}
              sizes="(max-width: 760px) 84vw, (max-width: 1000px) 38vw, 410px"
              width={880}
              height={1100}
              alt={alt}
              fetchPriority="high"
            />
          </figure>
        )}
      </div>
      {portrait && <div className="visual-switch" role="group" aria-label="Hero image">
        <button
          type="button"
          aria-controls="hero-visual-stage"
          aria-pressed={!wireframe}
          onClick={() => setWireframe(false)}
        >
          <UserRound size={13} />
          Portrait
        </button>
        <button
          type="button"
          aria-controls="hero-visual-stage"
          aria-pressed={wireframe}
          onClick={() => setWireframe(true)}
        >
          <Box size={13} />
          Wireframe
        </button>
      </div>}
    </div>
  );
}
