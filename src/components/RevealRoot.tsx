"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

// Scroll reveals for server-rendered sections, driven by data attributes:
// data-split (headline line mask), data-reveal (fade up), data-scramble (HUD decode), data-count (sliding number)
export const RevealRoot = ({ children }: { children: ReactNode }) => {
  const root = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();

  useGSAP(
    () => {
      if (!enabled || !root.current) return;
      const scope = root.current;
      let cancelled = false;
      // Created async (after fonts load), so keep our own context and revert it on cleanup
      const context = gsap.context(() => {}, scope);

      document.fonts.ready.then(() => {
        if (cancelled) return;
        context.add(() => {
          gsap.utils.toArray<HTMLElement>("[data-split]", scope).forEach((element) => {
            SplitText.create(element, {
              type: "lines",
              mask: "lines",
              linesClass: "split-line",
              autoSplit: true,
              onSplit: (split) =>
                gsap.from(split.lines, {
                  yPercent: 110,
                  duration: 1,
                  ease: "expo.out",
                  stagger: 0.08,
                  scrollTrigger: { trigger: element, start: "top 85%", once: true },
                }),
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-reveal]", scope).forEach((element) => {
            gsap.from(element, {
              opacity: 0,
              y: 40,
              duration: 0.9,
              ease: "expo.out",
              delay: Number(element.dataset.delay ?? 0),
              scrollTrigger: { trigger: element, start: "top 90%", once: true },
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-scramble]", scope).forEach((element) => {
            const text = element.textContent ?? "";
            gsap.to(element, {
              duration: 1.1,
              scrambleText: { text, chars: "01<>/_#=+", speed: 0.6 },
              scrollTrigger: { trigger: element, start: "top 92%", once: true },
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-count]", scope).forEach((element) => {
            const target = Number(element.dataset.count);
            const counter = { value: 0 };
            gsap.to(counter, {
              value: target,
              duration: 1.6,
              ease: "expo.out",
              scrollTrigger: { trigger: element, start: "top 90%", once: true },
              onUpdate: () => {
                element.textContent = String(Math.round(counter.value));
              },
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-xp]", scope).forEach((element) => {
            gsap.from(element, {
              scaleX: 0,
              duration: 1.4,
              ease: "expo.out",
              scrollTrigger: { trigger: element, start: "top 90%", once: true },
            });
          });
        });
        ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        context.revert();
      };
    },
    { scope: root, dependencies: [enabled], revertOnUpdate: true },
  );

  return <div ref={root}>{children}</div>;
};
