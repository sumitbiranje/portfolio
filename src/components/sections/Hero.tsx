"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { person } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import styles from "./Hero.module.scss";

const NODE_LABELS = ["Agents", "RAG", "MCP", "Graph", "Evals"];

// The particles themselves live in <ParticleField />, fixed behind the whole page.
export const Hero = () => {
  const root = useRef<HTMLElement>(null);
  const { enabled } = useMotion();

  // Scroll choreography: intro copy out, morph copy + node labels in
  useGSAP(
    () => {
      if (!enabled) return;
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      timeline
        .to("[data-intro]", { opacity: 0, y: -60, duration: 0.25 }, 0.05)
        .to("[data-name]", { opacity: 0.08, scale: 0.94, duration: 0.3 }, 0.05)
        .fromTo("[data-morph]", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.2 }, 0.45)
        .fromTo("[data-node]", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, stagger: 0.04, duration: 0.15 }, 0.6)
        .to({}, { duration: 0.15 });

      gsap.from("[data-corner]", { opacity: 0, y: 12, stagger: 0.08, duration: 0.9, ease: "expo.out", delay: 0.2 });
      return () => ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [enabled], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage}>
        <div className={styles.glow} aria-hidden="true" />

        <div className={styles.corners} aria-hidden="true">
          <span className="label" data-corner>
            <i className={styles.square} /> AI Engineer · Agentic systems
          </span>
          <span className="label" data-corner>
            Pune, IN · Remote worldwide
          </span>
          <span className="label" data-corner>
            01 / Signal from noise
          </span>
          <span className="label" data-corner>
            Scroll to decode <ArrowDown size={12} />
          </span>
        </div>

        <div className={styles.content}>
          <h1 id="hero-title" className={styles.name} data-name>
            {person.firstName} <em>{person.lastName}</em>
          </h1>
          <div className={styles.intro} data-intro>
            <p className={styles.headline}>{person.headline}</p>
            <p className={styles.sub}>{person.subheadline}</p>
            <div className={styles.ctas}>
              <Link href="/#contact" className={styles.primary}>
                Start a project <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/#work" className={styles.ghost}>
                See the work <ArrowDown size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.morph} data-morph>
          <span className="label">02 / What I do</span>
          <p className={styles.morphTitle}>
            Noise in. <em>Structure</em> out.
          </p>
          <p className={styles.morphText}>
            Codebases, specs and documents go in. Agents, retrieval and knowledge graphs turn them into answers you can
            trust.
          </p>
        </div>

        <ul className={styles.nodes} aria-hidden="true">
          {NODE_LABELS.map((label) => (
            <li key={label} data-node>
              <i /> {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
