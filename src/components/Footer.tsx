"use client";

import { useEffect, useState } from "react";
import { links, person } from "@/content/site";
import styles from "./Footer.module.scss";

const formatPuneTime = () =>
  new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(
    new Date(),
  );

const LocalTime = () => {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(formatPuneTime());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time ?? "--:--"} IST</span>;
};

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={`container ${styles.inner}`}>
      <p className={styles.big} aria-hidden="true">
        {person.firstName} <em>{person.lastName}</em>
      </p>
      <div className={styles.row}>
        <span className="label">
          Pune · <LocalTime />
        </span>
        <ul className={styles.links}>
          <li>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={links.email}>Email</a>
          </li>
          <li>
            <a href="/llms.txt">llms.txt</a>
          </li>
        </ul>
        <span className="label">Built with Next.js · Three.js · GSAP</span>
      </div>
    </div>
  </footer>
);
