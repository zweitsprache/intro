"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { modules } from "@/lib/content";
import styles from "@/app/lms.module.css";

type Props = { level: string; title: string };

export default function ModuleBrowser({ level, title }: Props) {
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const levelCode = level.split(".")[0];

  function jumpToModule(index: number) {
    const card = document.getElementById(`modul-card-${index + 1}`);
    if (!card) return;
    window.scrollTo({ top: window.scrollY + card.getBoundingClientRect().top - 96, behavior: "smooth" });
    setHighlighted(index);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setHighlighted(null), 1800);
  }

  return (
    <main className={`${styles.page} ${styles.modulePage}`}>
      <section className={styles.courseHero} aria-label={`${level} ${title}`}>
        <Image src="/images/amira.jpg" alt="Amira mit ihrer Familie" fill priority sizes="(max-width: 760px) 100vw, 1200px" />
        <div className={styles.courseHeroPanel}>
          <span className={`${styles.badge} ${styles.badgeBrand} ${styles.badgeLarge}`}>{level}</span>
          <h1>
            <strong>{level === "A1.1" ? "Intro" : title}</strong>
            <span>Deutsch für die Schweiz {levelCode}</span>
          </h1>
        </div>
      </section>
      <div className={styles.moduleTitleBlock}>
        <nav className={styles.moduleNav} aria-label="Module">
          {modules.map((_, index) => (
            <button className={styles.moduleButton} key={index} onClick={() => jumpToModule(index)}>
              <span>Modul {index + 1}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className={styles.moduleGrid}>
        {modules.map((module, moduleIndex) => (
          <Link className={`${styles.moduleCard} ${highlighted === moduleIndex ? styles.moduleHighlight : ""}`} href={`/courses/${level.toLowerCase()}/${moduleIndex + 1}`} id={`modul-card-${moduleIndex + 1}`} key={module.title}>
            <div className={styles.moduleMedia}>
              <Image src="/images/amira.jpg" alt="Amira mit ihrer Familie" fill sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 560px" />
              <div className={styles.moduleCaption}>
                <span>Modul {moduleIndex + 1}</span>
                <strong>{module.title}</strong>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}