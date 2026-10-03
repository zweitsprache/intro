"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import styles from "./site-header.module.css";

export default function SiteHeader() {
  const pathname = usePathname();
  const coursesActive = pathname.startsWith("/courses");
  const activitiesActive = pathname.startsWith("/activities");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logo} href="/courses" aria-label="Zur Kursübersicht">
          <Image src="/images/intro_logo.svg" alt="" width={36} height={36} priority />
        </Link>
        <nav className={styles.nav} aria-label="Hauptnavigation">
          <Link className={coursesActive ? styles.active : undefined} href="/courses" aria-current={coursesActive ? "page" : undefined}>Kurse</Link>
          <Link className={activitiesActive ? styles.active : undefined} href="/activities" aria-current={activitiesActive ? "page" : undefined}>Aktivitäten</Link>
          <a href="#konto"><UserRound size={18} strokeWidth={1.8} />Mein Konto</a>
        </nav>
      </div>
    </header>
  );
}