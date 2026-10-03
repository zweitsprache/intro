import { notFound } from "next/navigation";
import LessonView from "@/components/lesson-view";
import { getCourse, modules } from "@/lib/content";

const GREETINGS = ["Hallo", "Tschüss", "Guten Tag", "Guten Morgen", "Guten Abend", "Gute Nacht", "Auf Wiederhören", "Auf Wiedersehen"];

function shuffle<T>(items: T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[otherIndex]] = [shuffled[otherIndex], shuffled[index]];
  }
  return shuffled;
}

export default async function LessonPage({ params }: PageProps<"/courses/[level]/[module]/[lesson]">) {
  const { level, module: moduleSlug, lesson: lessonSlug } = await params;
  const course = getCourse(level);
  const moduleNumber = Number(moduleSlug);
  const lessonNumber = Number(lessonSlug);
  const courseModule = modules[moduleNumber - 1];
  const lesson = courseModule?.lessons[lessonNumber - 1];
  if (!course || !courseModule || !lesson) notFound();
  const greetings = moduleNumber === 1 && lessonNumber === 1 ? shuffle(GREETINGS) : [];
  return <LessonView level={course.level} moduleNumber={moduleNumber} lessonNumber={lessonNumber} moduleTitle={courseModule.title} lessonTitle={lesson.title} greetings={greetings} />;
}