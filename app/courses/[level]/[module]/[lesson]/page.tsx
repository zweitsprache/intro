import { notFound } from "next/navigation";
import LessonView from "@/components/lesson-view";
import { getCourse, modules } from "@/lib/content";

export default async function LessonPage({ params }: PageProps<"/courses/[level]/[module]/[lesson]">) {
  const { level, module: moduleSlug, lesson: lessonSlug } = await params;
  const course = getCourse(level);
  const moduleNumber = Number(moduleSlug);
  const lessonNumber = Number(lessonSlug);
  const courseModule = modules[moduleNumber - 1];
  const lesson = courseModule?.lessons[lessonNumber - 1];
  if (!course || !courseModule || !lesson) notFound();
  return <LessonView level={course.level} moduleNumber={moduleNumber} lessonNumber={lessonNumber} moduleTitle={courseModule.title} lessonTitle={lesson.title} />;
}