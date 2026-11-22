"use client";

import { useMotion } from "@/lib/motion";
import styles from "./MotionToggle.module.scss";

export const MotionToggle = () => {
  const { enabled, toggle } = useMotion();
  return (
    <button type="button" className={styles.toggle} onClick={toggle} aria-pressed={enabled}>
      <span className={styles.bars} data-on={enabled} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      Motion {enabled ? "on" : "off"}
    </button>
  );
};
