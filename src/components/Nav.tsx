import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { person } from "@/content/site";
import styles from "./Nav.module.scss";

const items = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#story", label: "Story" },
];

export const Nav = () => (
  <header className={styles.wrap}>
    <nav className={styles.nav} aria-label="Primary">
      <Link href="/" className={styles.mono}>
        SB<span className="sr-only">, {person.name}, home</span>
      </Link>
      <span className={styles.status}>
        <span className={styles.dot} aria-hidden="true" />
        {person.availability}
      </span>
      <ul className={styles.links}>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <Link href="/#contact" className={styles.cta}>
        Start a project <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </nav>
  </header>
);
