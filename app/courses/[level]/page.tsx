import { notFound } from "next/navigation";
import ModuleBrowser from "@/components/module-browser";
import { getCourse } from "@/lib/content";

export default async function CourseLevelPage({ params }: PageProps<"/courses/[level]">) {
  const { level } = await params;
  const course = getCourse(level);
  if (!course) notFound();
  return <ModuleBrowser level={course.level} title={course.title} />;
}