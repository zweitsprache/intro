import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { courses } from "@/lib/content";
import styles from "../lms.module.css";

export default function CoursesPage() {
  return (
    <main className={`${styles.page} ${styles.coursePage}`}>
      <div className={styles.heading}>
        <h1>Kurse</h1>
        <p>Wählen Sie Ihr Niveau. Jeder Kurs hat Module, jedes Modul hat kurze Lektionen.</p>
      </div>
      <Link className={styles.resumeLink} href="/courses/a1.1/2/2">
        <div className={styles.resumeCard}>
          <div className={styles.eyebrow}>Weiterlernen</div>
          <div className={styles.resumeTitle}>Wie spät ist es?</div>
          <div className={styles.resumeBottom}>
            <span>A1.1 · Modul 2 · Lektion 2 · ca. 15 Min.</span>
            <span className={styles.inverseButton}>Fortsetzen <ArrowRight size={18} /></span>
          </div>
        </div>
      </Link>
      <h2 className={styles.sectionTitle}>Alle Niveaus</h2>
      <div className={styles.courseGrid}>
        {courses.map((course) => {
          const progress = Math.round((course.done / course.lessons) * 100);
          return (
            <Link className={styles.courseCard} href={`/courses/${course.level.toLowerCase()}`} key={course.level}>
              <div className={styles.courseCardTop}>
                <span className={styles.level}>{course.level}</span>
                <span className={`${styles.badge} ${course.done ? styles.badgeInfo : styles.badgeNeutral}`}>
                  {course.done ? "Begonnen" : "Nicht begonnen"}
                </span>
              </div>
              <div className={styles.courseCopy}>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
              <div className={styles.progressBlock}>
                <div className={styles.progressTrack} role="progressbar" aria-label={`${course.level} Fortschritt`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                  <span style={{ width: `${progress}%` }} />
                </div>
                <div className={styles.progressCaption}>
                  <span>{course.modules} Module · {course.lessons} Lektionen</span>
                  <span>{progress} %</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}