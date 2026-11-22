"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { person } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import type { SignalScene } from "@/components/three/SignalScene";
import styles from "./Hero.module.scss";

const NODE_LABELS = ["Agents", "RAG", "MCP", "Graph", "Evals"];


const INTERACTION_EVENTS = ["pointerdown", "pointermove", "wheel", "touchstart", "keydown", "scroll"] as const;

// Keep WebGL off the critical path: start after the page has loaded and the main thread is idle.
// On phones, wait for the first interaction (or a few seconds) so first paint stays fast.
const whenReadyForWebGL = (callback: () => void, isMobile: boolean) => {
  let cancelled = false;
  let idleId: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const run = () => {
    if (cancelled) return;
    cleanupListeners();
    if (timer) clearTimeout(timer);
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => !cancelled && callback(), { timeout: 1200 });
    } else {
      timer = setTimeout(() => !cancelled && callback(), 200);
    }
  };
  const cleanupListeners = () => {
    INTERACTION_EVENTS.forEach((name) => window.removeEventListener(name, run));
    window.removeEventListener("load", onLoad);
  };
  const onLoad = () => {
    if (!isMobile) return run();
    INTERACTION_EVENTS.forEach((name) => window.addEventListener(name, run, { once: true, passive: true }));
    timer = setTimeout(run, 4000);
  };

  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad, { once: true });

  return () => {
    cancelled = true;
    cleanupListeners();
    if (timer) clearTimeout(timer);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
  };
};

export const Hero = () => {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SignalScene | null>(null);
  const progressRef = useRef(0);
  const { enabled } = useMotion();

  // WebGL scene: loaded after idle, only when motion is on, paused off-screen
  useEffect(() => {
    if (!enabled || !canvasRef.current) return;
    const canvas = canvasRef.current;
    let disposed = false;
    let observer: IntersectionObserver | undefined;

    const isMobile = window.matchMedia("(max-width: 899px)").matches;
    const cancelIdle = whenReadyForWebGL(async () => {
      const { SignalScene } = await import("@/components/three/SignalScene");
      if (disposed) return;
      const scene = new SignalScene({ canvas, portraitSrc: person.portrait ?? undefined, isMobile });
      await scene.init();
      if (disposed) {
        scene.dispose();
        return;
      }
      scene.setProgress(progressRef.current);
      sceneRef.current = scene;
      canvas.dataset.ready = "true";
      observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? scene.start() : scene.stop()));
      observer.observe(canvas);
    }, isMobile);

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      sceneRef.current?.setPointer(x, y);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      disposed = true;
      cancelIdle();
      observer?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      sceneRef.current?.dispose();
      sceneRef.current = null;
      delete canvas.dataset.ready;
    };
  }, [enabled]);

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
          onUpdate: (self) => {
            progressRef.current = self.progress;
            sceneRef.current?.setProgress(Math.min(1, self.progress * 1.35));
          },
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
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
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
