"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Loader.module.scss";

const SEEN_KEY = "sb-loaded";

const hasSeenLoader = () => {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

export const Loader = () => {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isPhone = window.matchMedia("(max-width: 899px)").matches;
      if (isPhone || hasSeenLoader() || reduce || document.documentElement.dataset.motion === "off") {
        setDone(true);
        return;
      }

      const counter = { value: 0 };
      const timeline = gsap.timeline({
        onComplete: () => {
          try {
            window.sessionStorage.setItem(SEEN_KEY, "1");
          } catch {
            // Ignore storage failures; the loader just shows again next time.
          }
          setDone(true);
        },
      });

      timeline
        .to(counter, {
          value: 100,
          duration: 1.1,
          ease: "power2.inOut",
          onUpdate: () => {
            const count = root.current?.querySelector("[data-count]");
            if (count) count.textContent = String(Math.round(counter.value)).padStart(3, "0");
          },
        })
        .to("[data-bar]", { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0)
        .to("[data-panel]", { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "+=0.1");
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} className={styles.loader} aria-hidden="true">
      <div className={styles.panel} data-panel>
        <div className={styles.inner}>
          <span className="label">Initialising agents…</span>
          <span className={styles.count} data-count>
            000
          </span>
        </div>
        <span className={styles.bar} data-bar />
      </div>
    </div>
  );
};
