"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, CircleCheck, Clock3, Headphones, Play, Volume2 } from "lucide-react";
import { dialogue, timeExercises, vocabulary } from "@/lib/content";
import PronunciationPractice from "@/components/pronunciation-practice";
import styles from "@/app/lms.module.css";

const steps = ["Wortschatz", "Dialog", "Übung", "Abschluss"];
const greetingAudio = [
  { greeting: "Hallo", file: "a1-1-hallo.mp3" },
  { greeting: "Tschüss", file: "a1-1-tschuess.mp3" },
  { greeting: "Guten Tag", file: "a1-1-guten-tag.mp3" },
  { greeting: "Guten Morgen", file: "a1-1-guten-morgen.mp3" },
  { greeting: "Guten Abend", file: "a1-1-guten-abend.mp3" },
  { greeting: "Gute Nacht", file: "a1-1-gute-nacht.mp3" },
  { greeting: "Auf Wiederhören", file: "a1-1-auf-wiederhoeren.mp3" },
  { greeting: "Auf Wiedersehen", file: "a1-1-auf-wiedersehen.mp3" },
];

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-CH";
  window.speechSynthesis.speak(utterance);
}

type Props = { level: string; moduleNumber: number; lessonNumber: number; moduleTitle: string; lessonTitle: string; greetings: string[] };

export default function LessonView({ level, moduleNumber, lessonNumber, moduleTitle, lessonTitle, greetings }: Props) {
  const greetingPlayer = useRef<HTMLAudioElement>(null);
  const [step, setStep] = useState(0);
  const [greetingTarget, setGreetingTarget] = useState<string | null>(null);
  const [greetingAnswer, setGreetingAnswer] = useState<string | null>(null);
  const [completedGreetings, setCompletedGreetings] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const answered = Object.keys(answers).length;
  const correct = timeExercises.filter((exercise, index) => answers[index] === exercise.answer).length;
  const moduleHref = `/courses/${level.toLowerCase()}`;
  const isGreetingLesson = moduleNumber === 1 && lessonNumber === 1;

  function playRandomGreeting() {
    const choices = greetingAudio.filter((item) => item.greeting !== greetingTarget);
    const prompt = choices[Math.floor(Math.random() * choices.length)];
    const player = greetingPlayer.current;
    if (!player) return;

    setGreetingTarget(prompt.greeting);
    setGreetingAnswer(null);
    player.pause();
    player.src = `/audio/a1-1/${prompt.file}`;
    player.currentTime = 0;
    player.load();
    void player.play().catch(() => setGreetingAnswer("__audio-error__"));
  }

  function answerGreeting(greeting: string) {
    if (!greetingTarget || greetingAnswer !== null) return;
    setGreetingAnswer(greeting);
    if (greeting === greetingTarget) {
      setCompletedGreetings((current) => current.includes(greeting) ? current : [...current, greeting]);
    }
  }

  function toggleCheck() {
    if (checked) {
      setAnswers({});
      setChecked(false);
      return;
    }
    setChecked(true);
  }

  return (
    <main className={`${styles.page} ${styles.lessonPage}`}>
      <nav className={styles.breadcrumb} aria-label="Brotkrumennavigation">
        <Link href="/courses">Kurse</Link><ChevronRight size={16} />
        <Link href={moduleHref}>{level}</Link><ChevronRight size={16} />
        <span>Modul {moduleNumber} · {moduleTitle}</span>
      </nav>

      <div className={styles.lessonHeading}>
        <h1>{lessonTitle}</h1>
        <div className={styles.lessonMeta}>
          <span className={`${styles.badge} ${styles.badgeBrand}`}>{level}</span>
          <span className={`${styles.badge} ${styles.badgeNeutral}`}><Clock3 size={14} /> ca. 15 Min.</span>
          <span className={styles.caption}>Lektion {lessonNumber} von 3</span>
        </div>
      </div>

      <nav className={styles.stepper} aria-label="Lektionsabschnitte">
        {steps.map((label, index) => (
          <button className={styles.stepButton} key={label} onClick={() => setStep(index)} aria-current={step === index ? "step" : undefined}>
            <span className={`${styles.stepBar} ${index <= step ? styles.stepBarOn : ""}`} />
            <span className={index === step ? styles.stepCurrent : index < step ? styles.stepDone : styles.stepUpcoming}>{index + 1} {label}</span>
          </button>
        ))}
      </nav>

      {step === 0 && (
        <section className={styles.lessonSection}>
          {isGreetingLesson ? (
            <article className={styles.greetingCard}>
              <div className={styles.greetingContent}>
                <button className={styles.greetingPlay} aria-label="Zufällige Begrüssung abspielen" onClick={playRandomGreeting}>
                  <Play size={22} fill="currentColor" />
                </button>
                <audio ref={greetingPlayer} preload="none" />
                <div className={styles.greetingGrid}>
                  {greetings.map((greeting) => {
                    const isAnswered = greetingAnswer !== null && greetingAnswer !== "__audio-error__";
                    const isCorrect = isAnswered && greeting === greetingTarget;
                    const isWrong = isAnswered && greeting === greetingAnswer && greetingAnswer !== greetingTarget;
                    const blurCorrectText = completedGreetings.includes(greeting);
                    return (
                      <button
                        className={`${styles.greetingTile} ${isCorrect ? styles.greetingCorrect : ""} ${isWrong ? styles.greetingWrong : ""}`}
                        key={greeting}
                        onClick={() => answerGreeting(greeting)}
                        disabled={!greetingTarget || greetingAnswer !== null}
                      ><span className={blurCorrectText ? styles.greetingTextBlur : ""}>{greeting}</span></button>
                    );
                  })}
                </div>
                {greetingAnswer === "__audio-error__" ? <p className={styles.greetingFeedback} role="status">Die Audiodatei konnte nicht abgespielt werden.</p> : null}
                {greetingAnswer !== null && greetingAnswer !== "__audio-error__" ? <p className={`${styles.greetingFeedback} ${greetingAnswer === greetingTarget ? styles.feedbackCorrect : styles.feedbackWrong}`} role="status">{greetingAnswer === greetingTarget ? "Richtig!" : "Nicht ganz. Hören Sie nochmals."}</p> : null}
              </div>
            </article>
          ) : (
            <>
              <div className={styles.sectionIntro}><h2>Wortschatz</h2><p>Hören Sie die Wörter. Sprechen Sie nach.</p></div>
              <div className={styles.vocabGrid}>
                {vocabulary.map((item) => (
                  <article className={styles.vocabCard} key={item.word}>
                    <div><h3>{item.word}</h3><p>{item.example}</p></div>
                    <button className={styles.iconButton} aria-label={`Anhören: ${item.word}`} onClick={() => speak(item.word)}><Volume2 size={18} /></button>
                    <PronunciationPractice text={item.word} />
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {step === 1 && (
        <section className={styles.lessonSection}>
          <div className={styles.dialogIntro}>
            <div className={styles.sectionIntro}><h2>Dialog</h2><p>Hören und lesen Sie den Dialog.</p></div>
            <button className={styles.secondaryButton} onClick={() => speak(dialogue.map((line) => line.join(": ")).join(" "))}><Headphones size={17} />Dialog anhören</button>
          </div>
          <div className={styles.dialogCard}>
            {dialogue.map(([person, line]) => <div className={styles.dialogLine} key={`${person}-${line}`}><span>{person}</span><p>{line}</p></div>)}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className={styles.lessonSection}>
          <div className={styles.sectionIntro}><h2>Übung</h2><p>Welches Wort passt? Wählen Sie.</p></div>
          <div className={styles.exercisePanel}>
            {timeExercises.map((exercise, index) => (
              <div className={styles.exerciseRow} key={exercise.time}>
                <div className={styles.exercisePrompt}>
                  <span className={styles.exerciseTime}>{exercise.time}</span>
                  <span>{exercise.before} <span className={`${styles.answerBlank} ${checked ? answers[index] === exercise.answer ? styles.answerCorrect : styles.answerWrong : ""}`}>{answers[index] ?? "?"}</span> {exercise.after}</span>
                </div>
                <div className={styles.answerOptions}>
                  {exercise.options.map((option) => {
                    const selected = answers[index] === option;
                    const isCorrectAnswer = checked && option === exercise.answer;
                    const isWrongPick = checked && selected && !isCorrectAnswer;
                    return (
                      <button
                        className={`${styles.answerOption} ${selected ? styles.answerSelected : ""} ${isCorrectAnswer ? styles.answerCorrect : ""} ${isWrongPick ? styles.answerWrong : ""}`}
                        key={option}
                        onClick={() => !checked && setAnswers((previous) => ({ ...previous, [index]: option }))}
                        disabled={checked}
                      >{option}</button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className={styles.exerciseFooter}>
              <span>{checked ? `${correct} von ${timeExercises.length} richtig` : `${answered} von ${timeExercises.length} beantwortet`}</span>
              <button className={styles.inverseAction} onClick={toggleCheck} disabled={!checked && answered !== timeExercises.length}>
                {checked ? "Zurücksetzen" : <><Check size={16} />Prüfen</>}
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className={styles.completionCard}>
          <CircleCheck size={48} color="var(--green-600)" strokeWidth={1.5} />
          <h2>Lektion abgeschlossen</h2>
          <p>Sie können jetzt nach der Uhrzeit fragen und die Uhrzeit sagen.</p>
          <strong>Sehr gut. Sie haben alle Schritte abgeschlossen.</strong>
          <div className={styles.completionActions}>
            <Link className={styles.primaryButton} href={`/courses/${level.toLowerCase()}/2/3`}>Nächste Lektion: Termine machen <ArrowRight size={18} /></Link>
            <Link className={styles.secondaryButton} href={moduleHref}>Zum Modul</Link>
          </div>
        </section>
      )}

      {step < 3 && (
        <div className={styles.lessonFooter}>
          <button className={styles.secondaryButton} onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}><ArrowLeft size={17} />Zurück</button>
          <button className={styles.primaryButton} onClick={() => setStep((current) => Math.min(3, current + 1))}>Weiter<ArrowRight size={17} /></button>
        </div>
      )}
    </main>
  );
}