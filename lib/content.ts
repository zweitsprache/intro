export type LessonStatus = "done" | "current" | "todo";

export type Lesson = {
  title: string;
  duration: number;
  status: LessonStatus;
};

export type Module = {
  title: string;
  lessons: Lesson[];
};

export const courses = [
  { level: "A1.1", title: "Erste Schritte", description: "Sich vorstellen, Zahlen, Uhrzeit und Familie.", modules: 6, lessons: 18, done: 4 },
  { level: "A1.2", title: "Im Alltag", description: "Wohnen, Einkaufen und Termine vereinbaren.", modules: 6, lessons: 18, done: 0 },
  { level: "A2.1", title: "Unterwegs", description: "Mobilität, Wege beschreiben und Freizeit.", modules: 6, lessons: 20, done: 0 },
  { level: "A2.2", title: "Arbeit und Gesundheit", description: "Am Arbeitsplatz und beim Arzt.", modules: 6, lessons: 20, done: 0 },
  { level: "B1.1", title: "Mitreden", description: "Meinungen sagen und Erfahrungen erzählen.", modules: 6, lessons: 22, done: 0 },
  { level: "B1.2", title: "Selbstständig", description: "Behörden, Schule und Briefe schreiben.", modules: 6, lessons: 22, done: 0 },
];

export const modules: Module[] = [
  { title: "Hallo, Samir.", lessons: [{ title: "Hallo und Tschüss", duration: 10, status: "done" }, { title: "Wie heissen Sie?", duration: 12, status: "done" }, { title: "Woher kommen Sie?", duration: 15, status: "done" }] },
  { title: "Wie geht es Dir, Lena?", lessons: [{ title: "Zahlen von 0 bis 20", duration: 12, status: "done" }, { title: "Wie spät ist es?", duration: 15, status: "current" }, { title: "Termine machen", duration: 15, status: "todo" }] },
  { title: "Ich wohne in Burzikon.", lessons: [{ title: "Meine Familie", duration: 12, status: "todo" }, { title: "Wie alt sind Sie?", duration: 10, status: "todo" }, { title: "Das ist mein Bruder", duration: 15, status: "todo" }] },
  { title: "Am Dienstag habe ich einen Termin.", lessons: [{ title: "Wo wohnen Sie?", duration: 10, status: "todo" }, { title: "Meine Wohnung", duration: 15, status: "todo" }, { title: "Zimmer und Möbel", duration: 15, status: "todo" }] },
  { title: "Einkaufen", lessons: [{ title: "Obst und Gemüse", duration: 12, status: "todo" }, { title: "Im Supermarkt", duration: 15, status: "todo" }, { title: "Was kostet das?", duration: 15, status: "todo" }] },
  { title: "Essen und Trinken", lessons: [{ title: "Das Frühstück", duration: 10, status: "todo" }, { title: "Im Café", duration: 15, status: "todo" }, { title: "Was essen Sie gern?", duration: 12, status: "todo" }] },
];

export const vocabulary = [
  { word: "die Uhr", example: "Es ist drei Uhr." },
  { word: "die Stunde", example: "Eine Stunde hat 60 Minuten." },
  { word: "die Minute", example: "Der Bus kommt in fünf Minuten." },
  { word: "halb", example: "Es ist halb vier." },
  { word: "Viertel nach", example: "Es ist Viertel nach zehn." },
  { word: "Viertel vor", example: "Es ist Viertel vor neun." },
];

export const dialogue = [
  ["Frau Keller", "Entschuldigung, wie spät ist es?"],
  ["Herr Rossi", "Es ist Viertel nach zehn."],
  ["Frau Keller", "Danke. Wann fährt der Bus nach Bern?"],
  ["Herr Rossi", "Um halb elf."],
  ["Frau Keller", "Vielen Dank."],
  ["Herr Rossi", "Gern geschehen."],
] as const;

export const timeExercises = [
  { time: "14:30", before: "Es ist", after: "drei.", answer: "halb", options: ["halb", "Viertel", "Uhr"] },
  { time: "10:15", before: "Es ist Viertel", after: "zehn.", answer: "nach", options: ["vor", "nach", "halb"] },
  { time: "08:45", before: "Es ist Viertel", after: "neun.", answer: "vor", options: ["nach", "um", "vor"] },
  { time: "12:00", before: "Es ist zwölf", after: ".", answer: "Uhr", options: ["Stunde", "Uhr", "Minute"] },
];

export function getCourse(level: string) {
  return courses.find((course) => course.level.toLowerCase() === level.toLowerCase());
}