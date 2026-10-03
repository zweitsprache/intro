"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import styles from "@/app/lms.module.css";

type Word = { Word: string; PronunciationAssessment?: { AccuracyScore: number; ErrorType: string } };
type Result = { total: number; words: Word[] };

const scoreColor = (score: number) => (score >= 80 ? "var(--green-600)" : score >= 60 ? "orange" : "crimson");

function beep() {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  oscillator.frequency.value = 880;
  oscillator.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
  oscillator.onended = () => void context.close();
}

export default function PronunciationPractice({ text }: { text: string }) {
  const [status, setStatus] = useState<"idle" | "preparing" | "listening" | "nothing" | "error">("idle");
  const [result, setResult] = useState<Result | null>(null);

  async function start() {
    setResult(null);
    setStatus("preparing");
    try {
      const tokenResponse = await fetch("/api/speech-token");
      if (!tokenResponse.ok) throw new Error("token");
      const { token, region } = await tokenResponse.json();

      // Load the SDK only when needed; it is large.
      const sdk = await import("microsoft-cognitiveservices-speech-sdk");
      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechRecognitionLanguage = "de-DE";
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      const assessment = new sdk.PronunciationAssessmentConfig(
        text,
        sdk.PronunciationAssessmentGradingSystem.HundredMark,
        sdk.PronunciationAssessmentGranularity.Phoneme,
        true,
      );
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      assessment.applyTo(recognizer);
      recognizer.sessionStarted = () => {
        beep();
        setStatus("listening");
      };
      recognizer.recognizing = (_, event) => console.log("Hearing:", event.result.text);
      recognizer.speechStartDetected = () => console.log("Speech start detected");

      recognizer.recognizeOnceAsync(
        (speech) => {
          if (speech.reason === sdk.ResultReason.RecognizedSpeech) {
            const pa = sdk.PronunciationAssessmentResult.fromResult(speech);
            setResult({ total: pa.pronunciationScore, words: pa.detailResult.Words as unknown as Word[] });
            setStatus("idle");
          } else {
            if (speech.reason === sdk.ResultReason.Canceled) {
              const details = sdk.CancellationDetails.fromResult(speech);
              console.error("Speech canceled:", sdk.CancellationReason[details.reason], details.errorDetails);
              setStatus("error");
            } else {
              console.warn("No speech match:", sdk.ResultReason[speech.reason], sdk.NoMatchDetails.fromResult(speech).reason);
              setStatus("nothing");
            }
          }
          recognizer.close();
        },
        () => {
          setStatus("error");
          recognizer.close();
        },
      );
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <button className={styles.iconButton} aria-label={`Aussprache üben: ${text}`} onClick={start} disabled={status === "preparing" || status === "listening"}>
        <Mic size={18} />
      </button>
      <div role="status" aria-live="polite">
        {status === "preparing" ? <p>Mikrofon wird vorbereitet …</p> : null}
        {status === "listening" ? <p>Sprechen Sie jetzt …</p> : null}
        {status === "nothing" ? <p>Nichts erkannt. Versuchen Sie es nochmals.</p> : null}
        {status === "error" ? <p>Fehler. Mikrofon oder Verbindung prüfen.</p> : null}
        {result ? (
          <p>
            {Math.round(result.total)} / 100{" "}
            {result.words.map((word, index) => (
              <span key={index} style={{ color: scoreColor(word.PronunciationAssessment?.AccuracyScore ?? 0) }}>{word.Word} </span>
            ))}
          </p>
        ) : null}
      </div>
    </div>
  );
}
