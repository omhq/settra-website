"use client";

import { useEffect, useRef } from "react";

export function AgentNativeBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const updatePointer = (event: PointerEvent) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const element = backdropRef.current;
        if (!element) return;

        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;
        element.style.setProperty("--pointer-x", `${x * 100}%`);
        element.style.setProperty("--pointer-y", `${y * 100}%`);
        element.style.setProperty("--parallax-x", `${(x - 0.5) * 18}px`);
        element.style.setProperty("--parallax-y", `${(y - 0.5) * 14}px`);
      });
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", updatePointer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="agent-backdrop" ref={backdropRef} aria-hidden="true">
      <div className="agent-backdrop-glow" />
      <svg
        className="agent-backdrop-graph"
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="graph-layer graph-layer-far">
          <path d="M72 214 C240 112 360 146 492 270" />
          <path d="M948 250 C1094 130 1260 166 1400 94" />
          <path d="M918 470 C1110 566 1270 532 1410 654" />
          <path d="M40 610 C210 498 350 530 512 446" />
        </g>

        <g className="graph-layer graph-layer-main">
          <path d="M164 378 C312 378 366 312 520 312" />
          <path d="M520 312 C618 312 632 380 720 380" />
          <path d="M720 380 C824 380 832 298 936 298" />
          <path d="M720 380 C824 380 842 474 966 474" />
          <path d="M936 298 C1076 298 1110 246 1248 246" />
          <path d="M966 474 C1090 474 1136 530 1284 530" />
        </g>

        <g className="graph-particles">
          <circle cx="286" cy="351" r="4" />
          <circle cx="606" cy="344" r="4" />
          <circle cx="838" cy="335" r="4" />
          <circle cx="854" cy="433" r="4" />
          <circle cx="1100" cy="275" r="4" />
          <circle cx="1122" cy="510" r="4" />
        </g>

        <g className="graph-node graph-node-source">
          <rect x="92" y="332" width="96" height="92" rx="16" />
          <path d="M92 360h96M124 332v92M156 332v92" />
        </g>

        <g className="graph-node graph-node-model">
          <rect x="474" y="268" width="92" height="88" rx="18" />
          <circle cx="502" cy="296" r="6" />
          <circle cx="538" cy="296" r="6" />
          <circle cx="520" cy="328" r="6" />
          <path d="M507 300l10 23M533 300l-10 23" />
        </g>

        <g className="graph-cube graph-cube-core">
          <path className="cube-top" d="M720 315l62 34-62 34-62-34z" />
          <path className="cube-left" d="M658 349l62 34v70l-62-35z" />
          <path className="cube-right" d="M782 349l-62 34v70l62-35z" />
        </g>

        <g className="graph-node graph-node-output graph-node-output-a">
          <rect x="900" y="262" width="72" height="72" rx="36" />
          <circle cx="936" cy="286" r="6" />
          <circle cx="918" cy="310" r="6" />
          <circle cx="954" cy="310" r="6" />
          <path d="M932 291l-10 14M940 291l10 14" />
        </g>

        <g className="graph-node graph-node-output graph-node-output-b">
          <rect x="930" y="438" width="72" height="72" rx="18" />
          <path d="M951 482v-13M966 482v-28M981 482v-19" />
        </g>

        <g className="graph-cube graph-cube-small graph-cube-one">
          <path className="cube-top" d="M1260 190l30 17-30 17-30-17z" />
          <path className="cube-left" d="M1230 207l30 17v34l-30-17z" />
          <path className="cube-right" d="M1290 207l-30 17v34l30-17z" />
        </g>

        <g className="graph-cube graph-cube-small graph-cube-two">
          <path className="cube-top" d="M1304 500l26 15-26 15-26-15z" />
          <path className="cube-left" d="M1278 515l26 15v30l-26-15z" />
          <path className="cube-right" d="M1330 515l-26 15v30l26-15z" />
        </g>
      </svg>
    </div>
  );
}
