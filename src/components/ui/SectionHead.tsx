import type { ReactNode } from "react";
import styles from "./SectionHead.module.scss";

type SectionHeadProps = {
  index: string;
  label: string;
  aside?: string;
  title: ReactNode;
  titleId: string;
  intro?: string;
};

export const SectionHead = ({ index, label, aside, title, titleId, intro }: SectionHeadProps) => (
  <div className={styles.head}>
    <div className={styles.rule}>
      <span className="label" data-scramble>
        {index} / {label}
      </span>
      {aside && <span className={`label ${styles.aside}`}>{aside}</span>}
    </div>
    <div className={styles.body}>
      <h2 id={titleId} className={styles.title} data-split>
        {title}
      </h2>
      {intro && (
        <p className={styles.intro} data-reveal>
          {intro}
        </p>
      )}
    </div>
  </div>
);
