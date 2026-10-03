import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleCheck, CirclePlay } from "lucide-react";
import type { Module } from "@/lib/content";
import styles from "@/app/lms.module.css";

type Props = {
  level: string;
  courseTitle: string;
  moduleNumber: number;
  courseModule: Module;
};

export default function ModuleLessons({ level, courseTitle, moduleNumber, courseModule }: Props) {
  const levelCode = level.split(".")[0];

  return (
    <main className={`${styles.page} ${styles.modulePage}`}>
      <div className={styles.moduleTitleBlock}>
        <Link className={styles.backLink} href={`/courses/${level.toLowerCase()}`}><ArrowLeft size={17} />Zurück zu {level}</Link>
        <span className={`${styles.badge} ${styles.badgeBrand} ${styles.badgeLarge}`}>{level} · Modul {moduleNumber}</span>
        <h1><strong>{courseTitle === "Erste Schritte" ? "Intro" : courseTitle}</strong><span> – Deutsch für die Schweiz {levelCode}</span></h1>
      </div>

      <section className={styles.selectedModule}>
        <div className={styles.selectedModuleImage}>
          <Image src="/images/amira.jpg" alt="Amira mit ihrer Familie" fill priority sizes="(max-width: 760px) 100vw, 1200px" />
          <div className={styles.moduleCaption}>
            <span>Modul {moduleNumber}</span>
            <strong>{courseModule.title}</strong>
          </div>
        </div>
      </section>

      <div className={styles.lessonPageHeading}>
        <div><h2>Lektionen</h2><p>{courseModule.lessons.length} kurze Lektionen</p></div>
        <Link className={styles.secondaryButton} href={`/courses/${level.toLowerCase()}`}>Alle Module</Link>
      </div>

      <div className={styles.lessonCardGrid}>
        {courseModule.lessons.map((lesson, lessonIndex) => {
          const lessonNumber = moduleNumber === 2 && lessonIndex === 1 ? 2 : lessonIndex + 1;
          return (
            <Link className={styles.lessonCard} href={`/courses/${level.toLowerCase()}/${moduleNumber}/${lessonNumber}`} key={lesson.title}>
              <div className={styles.lessonCardImage}>
                <Image src="/images/amira.jpg" alt="" fill sizes="(max-width: 620px) 100vw, (max-width: 1050px) 50vw, 360px" />
                <div className={styles.lessonCardCaption}>
                  <span>Lektion {lessonIndex + 1}</span>
                  <strong>{lesson.title}</strong>
                </div>
              </div>
              <div className={styles.lessonCardMeta}>
                <span className={styles.lessonCardStatus}>
                  {lesson.status === "done" ? <CircleCheck size={20} color="var(--green-600)" /> : null}
                  {lesson.status === "current" ? <CirclePlay size={20} color="var(--navy-700)" /> : null}
                  {lesson.status === "todo" ? <span className={styles.todoNumber}>{lessonIndex + 1}</span> : null}
                </span>
                <span className={`${styles.badge} ${lesson.status === "done" ? styles.badgeSuccess : lesson.status === "current" ? styles.badgeInfo : styles.badgeNeutral}`}>
                  {lesson.status === "done" ? "Abgeschlossen" : lesson.status === "current" ? "Weiterlernen" : "Nicht begonnen"}
                </span>
                <span className={styles.lessonDuration}>ca. {lesson.duration} Min.</span>
                <span className={styles.lessonCardArrow} aria-hidden="true"><ArrowRight size={18} /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}