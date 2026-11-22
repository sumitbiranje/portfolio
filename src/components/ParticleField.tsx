"use client";

import { useEffect, useRef } from "react";
import { person } from "@/content/site";
import { ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import type { ParticleScene } from "@/components/three/ParticleScene";
import styles from "./ParticleField.module.scss";

// Each section the particles visit, in scroll order. The hero morphs portrait → graph across its pinned
// height; every later section brings its own shape (see SHAPE_ORDER in ParticleScene).
const SECTION_SHAPES = [
  { id: "services", shape: 2 },
  { id: "work", shape: 3 },
  { id: "process", shape: 4 },
  { id: "story", shape: 5 },
  { id: "stack", shape: 6 },
  { id: "contact", shape: 7 },
] as const;

type Keyframe = { y: number; shape: number; hold: number };

const INTERACTION_EVENTS = ["pointerdown", "pointermove", "wheel", "touchstart", "keydown", "scroll"] as const;

// Keep WebGL off the critical path: start after load + idle. Phones wait for the first interaction (or 4s).
const whenReadyForWebGL = (callback: () => void, isMobile: boolean) => {
  let cancelled = false;
  let idleId: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const cleanupListeners = () => {
    INTERACTION_EVENTS.forEach((name) => window.removeEventListener(name, run));
    window.removeEventListener("load", onLoad);
  };
  function run() {
    if (cancelled) return;
    cleanupListeners();
    if (timer) clearTimeout(timer);
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => !cancelled && callback(), { timeout: 1200 });
    } else {
      timer = setTimeout(() => !cancelled && callback(), 200);
    }
  }
  function onLoad() {
    if (!isMobile) return run();
    INTERACTION_EVENTS.forEach((name) => window.addEventListener(name, run, { once: true, passive: true }));
    timer = setTimeout(run, 4000);
  }

  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad, { once: true });

  return () => {
    cancelled = true;
    cleanupListeners();
    if (timer) clearTimeout(timer);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
  };
};

const pageTop = (element: Element) => element.getBoundingClientRect().top + window.scrollY;

// Scroll positions where each shape is fully formed
const measureKeyframes = (): Keyframe[] => {
  const hero = document.getElementById("top");
  const viewport = window.innerHeight;
  const frames: Keyframe[] = [{ y: 0, shape: 0, hold: 0.12 }];
  if (hero) frames.push({ y: pageTop(hero) + hero.offsetHeight - viewport * 1.1, shape: 1, hold: 0.5 });
  for (const { id, shape } of SECTION_SHAPES) {
    const section = document.getElementById(id);
    if (section) frames.push({ y: pageTop(section) - viewport * 0.35, shape, hold: 0.45 });
  }
  return frames.sort((a, b) => a.y - b.y);
};

// Map scroll to shape progress: hold the current shape, then morph into the next one before its section
const progressAt = (scrollY: number, frames: Keyframe[]) => {
  if (frames.length === 0) return 0;
  if (scrollY <= frames[0].y) return frames[0].shape;
  for (let i = 0; i < frames.length - 1; i += 1) {
    const from = frames[i];
    const to = frames[i + 1];
    if (scrollY > to.y) continue;
    const t = (scrollY - from.y) / Math.max(1, to.y - from.y);
    const morph = Math.min(1, Math.max(0, (t - from.hold) / (1 - from.hold)));
    return from.shape + (to.shape - from.shape) * morph;
  }
  return frames[frames.length - 1].shape;
};

export const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { enabled } = useMotion();

  useEffect(() => {
    if (!enabled || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const isMobile = window.matchMedia("(max-width: 899px)").matches;
    let scene: ParticleScene | null = null;
    let frames: Keyframe[] = [];
    let disposed = false;

    const sync = () => scene?.setProgress(progressAt(window.scrollY, frames));
    const remeasure = () => {
      frames = measureKeyframes();
      sync();
    };
    const onPointer = (event: PointerEvent) => {
      scene?.setPointer((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1));
    };
    const onVisibility = () => (document.hidden ? scene?.stop() : scene?.start());

    const cancelReady = whenReadyForWebGL(async () => {
      const { ParticleScene } = await import("@/components/three/ParticleScene");
      if (disposed) return;
      const instance = new ParticleScene({ canvas, isMobile, portraitSrc: person.portrait ?? undefined });
      await instance.init();
      if (disposed) {
        instance.dispose();
        return;
      }
      scene = instance;
      remeasure();
      scene.start();
      canvas.dataset.ready = "true";
    }, isMobile);

    // Pinned sections change the page height, so re-measure whenever ScrollTrigger refreshes
    ScrollTrigger.addEventListener("refresh", remeasure);
    window.addEventListener("resize", remeasure);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      cancelReady();
      ScrollTrigger.removeEventListener("refresh", remeasure);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      scene?.dispose();
      delete canvas.dataset.ready;
    };
  }, [enabled]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
};
