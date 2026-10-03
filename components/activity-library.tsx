"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { BookOpen, Check, CircleHelp, FileText, Headphones, Mic, Pause, Play, Volume2 } from "lucide-react";
import styles from "@/app/lms.module.css";

const activities = [
  { id: "aud", number: "01", label: "Audio", title: "Audio-Player", description: "Gross für Hörtexte mit Mitlesetext, kompakt für kurze Aufnahmen in anderen Aktivitäten." },
  { id: "tf", number: "02", label: "Richtig / Falsch", title: "Richtig oder falsch?", description: "Aussagen zu einem kurzen Lesetext. Zwei grosse Schaltflächen pro Zeile." },
  { id: "tf2", number: "02b", label: "Richtig / Falsch", title: "Richtig oder falsch? Zweispaltig", description: "Text links, Aussagen rechts. Der Text bleibt beim Antworten sichtbar." },
  { id: "scq", number: "03", label: "Single Choice", title: "Eine Antwort wählen", description: "Genau eine Antwort ist richtig. Die ganze Zeile ist klickbar." },
  { id: "mcq", number: "04", label: "Multiple Choice", title: "Mehrere Antworten wählen", description: "Mehrere Antworten sind richtig. Nach dem Prüfen sieht man auch, was fehlt." },
  { id: "gapselect", number: "05", label: "Lückentext", title: "Lückentext mit Auswahl", description: "Wählen Sie das passende Wort für den Satz." },
  { id: "gapinput", number: "06", label: "Lückentext", title: "Lückentext mit Eingabe", description: "Schreiben Sie das fehlende Wort in die Lücke." },
  { id: "complete", number: "07", label: "Satz ergänzen", title: "Satz ergänzen", description: "Schreiben Sie Ihre eigene Antwort. Es gibt kein Richtig oder Falsch." },
  { id: "wordbank", number: "08", label: "Wortbank", title: "Lückentext mit Wortbank", description: "Tippen Sie auf ein Wort. Es kommt in die nächste freie Lücke." },
  { id: "listen", number: "09", label: "Hören", title: "Hören und wählen", description: "Hören Sie die Uhrzeit und wählen Sie die passende Antwort." },
  { id: "build", number: "10", label: "Satzbau", title: "Sätze bauen", description: "Tippen Sie die Wörter in die richtige Reihenfolge." },
  { id: "match", number: "11", label: "Zuordnen", title: "Zuordnen", description: "Verbinden Sie die Frage mit der passenden Antwort." },
  { id: "sort", number: "12", label: "Artikel", title: "Der, die oder das?", description: "Ordnen Sie jedes Wort dem richtigen Artikel zu." },
  { id: "cards", number: "13", label: "Karteikarten", title: "Karteikarten", description: "Drehen Sie die Karte um und üben Sie neue Wörter." },
  { id: "speak", number: "14", label: "Sprechen", title: "Nachsprechen und aufnehmen", description: "Hören Sie den Satz und nehmen Sie Ihre Stimme auf." },
];

function say(text: string, rate = 1) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-CH";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

function ActivityDemo({ id, scale }: { id: string; scale: number }) {
  const [choice, setChoice] = useState("");
  const [checks, setChecks] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [built, setBuilt] = useState<string[]>([]);
  const [paired, setPaired] = useState<Record<string, string>>({});
  const [activePair, setActivePair] = useState("");
  const [sorted, setSorted] = useState<Record<string, string>>({});
  const [flipped, setFlipped] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [speed, setSpeed] = useState(0);
  const recorder = useRef<MediaRecorder | null>(null);

  function toggleItem(value: string) {
    setChecks((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function pick(value: string) {
    if (!checked) setChoice(value);
  }

  function checkReset() {
    if (checked) {
      setChecked(false);
      setChoice("");
      setChecks([]);
      setText("");
      return;
    }
    setChecked(true);
  }

  async function toggleRecording() {
    if (recording) {
      recorder.current?.stop();
      setRecording(false);
      setRecorded(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.onstop = () => stream.getTracks().forEach((track) => track.stop());
      recorder.current = mediaRecorder;
      mediaRecorder.start();
      setRecorded(false);
      setRecording(true);
    } catch {
      setRecorded(false);
    }
  }

  const answerButton = (label: string, correctAnswer: string, key = id) => {
    const active = choice === label;
    const correct = checked && label === correctAnswer;
    const wrong = checked && active && label !== correctAnswer;
    return <button className={`${styles.demoButton} ${active ? styles.demoSelected : ""} ${correct ? styles.demoCorrect : ""} ${wrong ? styles.demoWrong : ""}`} data-answer-group={key} key={label} onClick={() => pick(label)}>{label}</button>;
  };

  let example: React.ReactNode;
  if (id === "aud") {
    example = <div className={styles.audioDemo}>
      <div className={styles.audioTop}><button className={styles.audioPlay} onClick={() => say("Guten Tag. Ich hätte gern einen Kaffee und ein Gipfeli.")} aria-label="Hörtext abspielen"><Play size={21} fill="currentColor" /></button><div className={styles.audioTitle}><span>Hörtext · A1.1</span><strong>Im Café</strong></div><button className={styles.outlineLight} onClick={() => { const rates = [1, 1.25, 0.75]; const next = (speed + 1) % rates.length; setSpeed(next); say("Guten Tag. Ich hätte gern einen Kaffee und ein Gipfeli.", rates[next]); }}>{["1×", "1,25×", "0,75×"][speed]}</button><button className={styles.outlineLight} onClick={() => setRevealed(!revealed)}><FileText size={15} />{revealed ? "Text ausblenden" : "Text anzeigen"}</button></div>
      <button className={styles.waveform} onClick={() => say("Guten Tag. Ich hätte gern einen Kaffee und ein Gipfeli.")} aria-label="Hörtext anhören">{Array.from({ length: 56 }, (_, i) => <span key={i} style={{ height: `${14 + ((i * 13) % 38)}px` }} />)}</button>
      <div className={styles.audioTimes}><span>0:00</span><span>0:08</span></div>
      {revealed && <div className={styles.transcript}><span>Frau Meier</span><p>Guten Tag. Ich hätte gern einen Kaffee und ein Gipfeli.</p></div>}
      <div className={styles.miniAudio}><button className={styles.smallPlay} onClick={() => say("das Gipfeli")} aria-label="Gipfeli anhören"><Play size={16} fill="currentColor" /></button><span>Wort anhören: das Gipfeli</span><small>0:00 / 0:02</small><div className={styles.miniTrack}><i /></div></div>
    </div>;
  } else if (id === "tf" || id === "tf2") {
    const statements = ["Amira kommt aus Syrien.", "Amira wohnt in Bern.", "Amira hat zwei Kinder.", "Amira lernt Deutsch."];
    const truth = ["Richtig", "Falsch", "Richtig", "Richtig"];
    example = <div className={id === "tf" ? styles.tfDemo : styles.twoColDemo}>
      {id === "tf" && <div className={styles.readingRow}><Image src="/images/amira.jpg" alt="Amira mit Kindern" width={250} height={150} /><div className={styles.readingText}><span><BookOpen size={18} /></span><p>Ich heisse Amira.<br />Ich komme aus Syrien.<br />Jetzt wohne ich in Basel.<br />Ich lerne Deutsch.<br />Ich habe zwei Kinder.</p></div></div>}
      {id === "tf2" && <div className={styles.readingBlock}>Ich heisse Amira. Ich komme aus Syrien. Jetzt wohne ich in Basel. Ich lerne Deutsch. Ich habe zwei Kinder.</div>}
      <div className={styles.tfStatements}>{statements.map((statement, index) => { const row = `${id}-${index}`; const selected = checks.find((item) => item.startsWith(`${row}:`))?.split(":")[1]; return <div className={styles.tfRow} key={statement}><div className={styles.tfPrompt}><b>{String(index + 1).padStart(2, "0")}</b><span>{statement}</span></div><div className={styles.demoChoiceRow}>{["Richtig", "Falsch"].map((label) => { const active = selected === label; const correct = checked && label === truth[index]; const wrong = checked && active && !correct; return <button className={`${styles.demoButton} ${active ? styles.demoSelected : ""} ${correct ? styles.demoCorrect : ""} ${wrong ? styles.demoWrong : ""}`} data-answer-group={row} disabled={checked} key={label} onClick={() => setChecks((items) => [...items.filter((item) => !item.startsWith(`${row}:`)), `${row}:${label}`])}>{label}</button>; })}</div></div>; })}<div className={styles.demoFooter}><span>{checked ? "Antworten geprüft" : ""}</span><button className={styles.demoPrimary} disabled={checks.length < 4 && !checked} onClick={checkReset}>{checked ? "Zurücksetzen" : "Prüfen"}</button></div></div>
    </div>;
  } else if (id === "scq") {
    const options = ["Es ist Viertel nach zehn.", "Es ist halb zehn.", "Es ist Viertel vor zehn."];
    example = <div className={styles.demoStack}><div className={styles.demoInstruction}><CircleHelp size={18} />Wie spät ist es? 10:15 Uhr</div>{options.map((option) => <button className={`${styles.radioTile} ${choice === option ? styles.demoSelected : ""} ${checked && option.startsWith("Es ist Viertel nach") ? styles.demoCorrect : ""} ${checked && choice === option && !option.startsWith("Es ist Viertel nach") ? styles.demoWrong : ""}`} onClick={() => pick(option)} key={option}><span className={styles.radioMark}>{choice === option ? "●" : ""}</span>{option}</button>)}<DemoFooter checked={checked} disabled={!choice} onClick={checkReset} /></div>;
  } else if (id === "mcq") {
    const options = ["die Uhr", "die Minute", "der Stuhl", "die Stunde"];
    const right = ["die Uhr", "die Minute", "die Stunde"];
    example = <div className={styles.demoStack}><div className={styles.demoInstruction}><Check size={18} />Welche Wörter passen zur Zeit?</div><div className={styles.checkboxGrid}>{options.map((option) => <button key={option} className={`${styles.checkboxTile} ${checks.includes(option) ? styles.demoSelected : ""} ${checked && right.includes(option) ? styles.demoCorrect : ""} ${checked && checks.includes(option) && !right.includes(option) ? styles.demoWrong : ""}`} onClick={() => !checked && toggleItem(option)}><span>{checks.includes(option) ? "✓" : ""}</span>{option}{checked && right.includes(option) && !checks.includes(option) ? <small>fehlt</small> : null}</button>)}</div><DemoFooter checked={checked} disabled={!checks.length} onClick={checkReset} /></div>;
  } else if (id === "gapselect") {
    example = <div className={styles.demoStack}><div className={styles.demoInstruction}><CircleHelp size={18} />Wählen Sie das passende Wort.</div><p className={styles.sentenceDemo}>Ich <select className={styles.inlineSelect} value={choice} onChange={(event) => pick(event.target.value)} disabled={checked}><option value="">wähle …</option><option>komme</option><option>kommt</option><option>kommen</option></select> aus Polen.</p><DemoFooter checked={checked} disabled={!choice} onClick={checkReset} correct={choice === "komme"} /></div>;
  } else if (id === "gapinput") {
    example = <div className={styles.demoStack}><div className={styles.demoInstruction}><CircleHelp size={18} />Schreiben Sie das passende Wort.</div><p className={styles.sentenceDemo}>Ich <input className={styles.inlineInput} value={text} onChange={(event) => setText(event.target.value)} placeholder="…" disabled={checked} /> aus Polen.</p><DemoFooter checked={checked} disabled={!text.trim()} onClick={checkReset} correct={text.trim().toLowerCase() === "komme"} /></div>;
  } else if (id === "complete") {
    example = <div className={styles.demoStack}><div className={styles.demoInstruction}><FileText size={18} />Ergänzen Sie den Satz.</div><p className={styles.sentenceDemo}>Ich heisse <input className={styles.inlineInput} value={text} onChange={(event) => setText(event.target.value)} placeholder="Ihr Name" /></p><button className={styles.demoSecondary} onClick={() => setRevealed(!revealed)}>{revealed ? "Beispiele ausblenden" : "Beispiele zeigen"}</button>{revealed && <p className={styles.handwriting}>Ich heisse Amira. · Ich heisse Samir.</p>}</div>;
  } else if (id === "wordbank") {
    const words = ["halb", "Uhr", "nach", "vor"];
    example = <div className={styles.wordBankDemo}><div className={styles.demoInstruction}><CircleHelp size={18} />Füllen Sie die Lücken.</div><p>Es ist <button className={styles.wordBlank} onClick={() => setBuilt((items) => items.slice(0, -1))}>{built[0] ?? "______"}</button> drei. Es ist Viertel <button className={styles.wordBlank} onClick={() => setBuilt((items) => items.slice(0, 1))}>{built[1] ?? "______"}</button> zehn.</p><div className={styles.wordBank}>{words.map((word) => <button className={styles.wordChip} key={word} disabled={built.includes(word)} onClick={() => setBuilt((items) => items.length < 2 ? [...items, word] : items)}>{word}</button>)}</div><div className={styles.demoFooter}><span>{built.length}/2 Wörter eingesetzt</span><button className={styles.inverseAction} disabled={built.length < 2} onClick={() => checked ? (setChecked(false), setBuilt([])) : setChecked(true)}>{checked ? "Zurücksetzen" : "Prüfen"}</button></div></div>;
  } else if (id === "listen") {
    const options = ["10:15", "10:30", "10:45"];
    example = <div className={styles.demoStack}><button className={styles.listenButton} onClick={() => say("Es ist Viertel nach zehn.")}><Headphones size={24} />Hörtext anhören</button><div className={styles.listenOptions}>{options.map((option) => answerButton(option, "10:15"))}</div><DemoFooter checked={checked} disabled={!choice} onClick={checkReset} /></div>;
  } else if (id === "build") {
    const pool = ["heisse", "Ich", "Samir", "." ];
    example = <div className={styles.demoStack}><div className={styles.demoInstruction}><Check size={18} />Bauen Sie den Satz.</div><div className={styles.buildLine}>{built.map((word, index) => <button className={styles.wordChip} key={`${word}-${index}`} onClick={() => setBuilt((items) => items.filter((_, i) => i !== index))}>{word}</button>)}</div><div className={styles.wordPool}>{pool.filter((word) => !built.includes(word)).map((word) => <button className={styles.wordChip} key={word} onClick={() => setBuilt((items) => [...items, word])}>{word}</button>)}</div><DemoFooter checked={checked} disabled={built.length !== pool.length} onClick={checkReset} correct={built.join(" ") === "Ich heisse Samir ."} /></div>;
  } else if (id === "match") {
    const questions = ["Wie heissen Sie?", "Woher kommen Sie?", "Wie alt sind Sie?"];
    const answers = ["A · Ich bin 24 Jahre alt.", "B · Ich heisse Amira.", "C · Ich komme aus Syrien."];
    example = <div className={styles.demoStack}><div className={styles.demoInstruction}><BookOpen size={18} />Ordnen Sie zu.</div><div className={styles.matchGrid}><div>{questions.map((item) => <button className={`${styles.matchTile} ${activePair === item ? styles.demoSelected : ""}`} key={item} onClick={() => setActivePair(item)}>{item}<span>{paired[item] ?? "?"}</span></button>)}</div><div>{answers.map((item) => { const letter = item.slice(0, 1); return <button className={styles.matchTile} key={item} onClick={() => { if (activePair) { setPaired((previous) => ({ ...previous, [activePair]: letter })); setActivePair(""); } }}>{item}</button>; })}</div></div><DemoFooter checked={checked} disabled={Object.keys(paired).length < 3} onClick={checkReset} /></div>;
  } else if (id === "sort") {
    const words = ["Tisch", "Uhr", "Buch", "Stuhl"];
    const groups = ["der", "die", "das"];
    example = <div className={styles.demoStack}><div className={styles.demoInstruction}><Check size={18} />Ordnen Sie die Wörter.</div><div className={styles.sortWords}>{words.filter((word) => !sorted[word]).map((word) => <button className={styles.wordChip} key={word} onClick={() => setChoice(word)}>{word}</button>)}</div><div className={styles.sortGroups}>{groups.map((group) => <div className={styles.sortGroup} key={group}><strong>{group}</strong><button onClick={() => { if (choice) { setSorted((previous) => ({ ...previous, [choice]: group })); setChoice(""); } }}>{Object.entries(sorted).filter(([, value]) => value === group).map(([word]) => word).join(", ") || "Wort hier ablegen"}</button></div>)}</div><DemoFooter checked={checked} disabled={Object.keys(sorted).length < 4} onClick={checkReset} /></div>;
  } else if (id === "cards") {
    example = <div className={styles.flashcardDemo}><div className={`${styles.flashcard} ${flipped ? styles.flashcardBack : ""}`} onClick={() => setFlipped(!flipped)} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setFlipped(!flipped)}>{flipped ? <><span>Es ist halb vier.</span><small>Plural: die Uhren</small></> : <strong>die Uhr</strong>}</div><div className={styles.flashcardControls}><span>1 / 6</span><button className={styles.demoSecondary} onClick={() => { setFlipped(false); }}>Noch nicht</button><button className={styles.demoPrimary} onClick={() => { setFlipped(false); }}>Gewusst</button></div></div>;
  } else {
    example = <div className={styles.demoStack}><div className={styles.demoInstruction}><Mic size={18} />Sprechen Sie den Satz nach.</div><div className={styles.speakModel}><button className={styles.smallPlay} onClick={() => say("Wie spät ist es?")} aria-label="Beispiel hören"><Volume2 size={18} /></button><span>Wie spät ist es?</span></div><div className={styles.recordControls}><button className={`${styles.recordButton} ${recording ? styles.recording : ""}`} onClick={toggleRecording}>{recording ? <Pause size={18} /> : <Mic size={18} />}{recording ? "Aufnahme stoppen" : "Aufnahme starten"}</button><span className={styles.recordStatus}>{recording ? "● Aufnahme läuft" : recorded ? "Aufnahme bereit" : "Mikrofon ist bereit"}</span></div><div className={styles.selfRating}>{["Gut", "Geht so", "Nochmals üben"].map((rating) => <button className={`${styles.wordChip} ${choice === rating ? styles.demoSelected : ""}`} key={rating} onClick={() => pick(rating)}>{rating}</button>)}</div></div>;
  }

  return <div className={styles.activityCard}><div className={styles.activityZoom} style={{ zoom: scale }}>{example}</div></div>;
}

function DemoFooter({ checked, disabled, onClick, correct }: { checked: boolean; disabled: boolean; onClick: () => void; correct?: boolean }) {
  return <div className={styles.demoFooter}><span>{checked ? correct === false ? "Noch nicht ganz. Versuchen Sie es nochmals." : "Antwort geprüft." : ""}</span><button className={styles.demoPrimary} disabled={!checked && disabled} onClick={onClick}>{checked ? "Zurücksetzen" : "Prüfen"}</button></div>;
}

function subscribeScale(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("dazlet-activity-scale", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("dazlet-activity-scale", callback);
  };
}

function getScaleSnapshot() {
  return Number(window.localStorage.getItem("dazlet-activity-scale") ?? 1.35);
}

function getServerScaleSnapshot() {
  return 1.35;
}

export default function ActivityLibrary() {
  const scale = useSyncExternalStore(subscribeScale, getScaleSnapshot, getServerScaleSnapshot);

  function updateScale(value: number) {
    window.localStorage.setItem("dazlet-activity-scale", String(value));
    window.dispatchEvent(new Event("dazlet-activity-scale"));
  }

  return (
    <>
      <div className={styles.activityHero} id="top">
        <div className={styles.activityHeroInner}>
          <span className={styles.activityOverline}>Bausteine für Lektionen</span>
          <h1>Aktivitäten</h1>
          <p>Alle Übungstypen mit Beispielen auf Niveau A1.1. Jede Aktivität hat dieselbe Form: Aufgabe, Inhalt, Prüfen.</p>
          <div className={styles.scaleControl}><strong>Textgrösse</strong>{[[1, "Normal"], [1.35, "Gross"], [1.6, "Sehr gross"]].map(([value, label]) => <button className={scale === value ? styles.scaleActive : ""} key={label} onClick={() => updateScale(Number(value))}>{label}</button>)}</div>
        </div>
      </div>
      <div className={styles.activityLayout}>
        <aside className={styles.activityToc}>
          <span>Inhalt</span>
          {activities.map((activity) => <Link href={`#${activity.id}`} key={activity.id}><small>{activity.number}</small>{activity.label}</Link>)}
        </aside>
        <main className={styles.activitySections}>
          {activities.map((activity) => <section className={styles.activitySection} id={activity.id} key={activity.id}>
            <div className={styles.activitySectionHeader}>
              <span>{activity.number} · {activity.label}</span>
              <h2>{activity.title}</h2>
              <p>{activity.description}</p>
            </div>
            <ActivityDemo id={activity.id} scale={scale} />
          </section>)}
        </main>
      </div>
    </>
  );
}