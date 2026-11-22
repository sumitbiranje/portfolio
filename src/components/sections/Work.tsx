"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/site";
import { Diagram } from "@/components/ui/Diagram";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { SectionHead } from "@/components/ui/SectionHead";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import styles from "./Work.module.scss";

export const Work = () => {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const { enabled } = useMotion();

  // Desktop: pin the section and scroll the quest cards horizontally
  useGSAP(
    () => {
      if (!enabled) return;
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px)", () => {
        const list = track.current;
        if (!list) return;
        const distance = () => list.scrollWidth - list.clientWidth;
        gsap.to(list, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-pin]",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const bar = root.current?.querySelector<HTMLElement>("[data-progress]");
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [enabled], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="work" className={styles.work} aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          index="04"
          label="Selected work"
          aside="Quests completed"
          titleId="work-title"
          title={
            <>
              Five AI systems. <em>Shipped.</em>
            </>
          }
          intro="Built at KPIT Technologies. Shown as redrawn architecture, with no confidential code, data or client names."
        />
      </div>
      <div className={styles.pin} data-pin>
        <ol ref={track} className={styles.track}>
          {projects.map((project) => (
            <li key={project.slug} className={styles.card}>
              <div className={styles.frame}>
                <div className={styles.frameBar} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>quest_{project.index}.arch</span>
                </div>
                <Diagram type={project.diagram} title={project.title} />
              </div>
              <div className={styles.meta}>
                <span className="label">Quest {project.index} / 05</span>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.tagline}>{project.tagline}</p>
                <ul className={styles.chips}>
                  {project.stack.slice(0, 4).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className={styles.links}>
                  <Link href={`/work/${project.slug}`} className={styles.link}>
                    Read case study <ArrowUpRight size={16} aria-hidden="true" />
                    <span className="sr-only">: {project.title}</span>
                  </Link>
                  <a href={project.repo} className={styles.repo} target="_blank" rel="noopener noreferrer">
                    <GithubIcon size={15} /> Architecture on GitHub
                    <span className="sr-only">: {project.title} (opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.progress} aria-hidden="true">
          <span data-progress />
        </div>
      </div>
    </section>
  );
};
