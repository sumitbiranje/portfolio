"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { links, person } from "@/content/site";
import styles from "./Contact.module.scss";

const PROJECT_TYPES = ["AI agents / workflows", "RAG / knowledge system", "Code intelligence / graphs", "AI for QA", "Hardening an LLM app", "Something else"];
const BUDGETS = ["Not sure yet", "< $2k", "$2k – $5k", "$5k – $15k", "$15k+"];

// No backend yet: the form composes an email in the visitor's mail app.
export const Contact = () => {
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !message) {
      setError("Please add your name and a short description of the project.");
      return;
    }
    setError("");
    const body = [
      `Name: ${name}`,
      `Email: ${data.get("email")}`,
      `Project type: ${data.get("type")}`,
      `Budget: ${data.get("budget")}`,
      "",
      message,
    ].join("\n");
    window.location.href = `mailto:${person.email}?subject=${encodeURIComponent(`Project enquiry from ${name}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className={`container ${styles.contact}`} aria-labelledby="contact-title">
      <div className={styles.head}>
        <div className={styles.who}>
          <Image src="/photos/sumit-avatar.webp" alt={`${person.name}`} width={64} height={64} className={styles.avatar} />
          <div>
            <p className={styles.whoName}>{person.name}</p>
            <span className="label" data-scramble>
              08 / Contact · replies in 48h
            </span>
          </div>
        </div>
        <h2 id="contact-title" className={styles.title} data-split>
          Let&apos;s build something that <em>ships</em>.
        </h2>
        <p className={styles.lead} data-reveal>
          Tell me about the workflow you want to automate or the AI feature you need. I reply within 48 hours.
        </p>
        <ul className={styles.direct} data-reveal>
          <li>
            <a href={links.email}>
              <Mail size={18} aria-hidden="true" /> {person.email}
            </a>
          </li>
          <li>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedinIcon /> LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href={links.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon /> GitHub <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </li>
        </ul>
        <p className={styles.soft}>Also open to the right full-time AI Engineer role, anywhere.</p>
      </div>

      <form className={styles.form} onSubmit={onSubmit} noValidate data-reveal>
        <div className={styles.row}>
          <label className={styles.field}>
            <span>Name</span>
            <input name="name" autoComplete="name" required />
          </label>
          <label className={styles.field}>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.field}>
            <span>Project type</span>
            <select name="type" defaultValue={PROJECT_TYPES[0]}>
              {PROJECT_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>Budget</span>
            <select name="budget" defaultValue={BUDGETS[0]}>
              {BUDGETS.map((budget) => (
                <option key={budget}>{budget}</option>
              ))}
            </select>
          </label>
        </div>
        <label className={styles.field}>
          <span>What are you building?</span>
          <textarea name="message" rows={5} required aria-describedby={error ? "contact-error" : undefined} />
        </label>
        {error && (
          <p id="contact-error" className={styles.error} role="alert">
            {error}
          </p>
        )}
        <button type="submit" className={styles.submit}>
          Send enquiry <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
};
