import { notFound } from "next/navigation";
import ModuleLessons from "@/components/module-lessons";
import { getCourse, modules } from "@/lib/content";

export default async function ModulePage({ params }: PageProps<"/courses/[level]/[module]">) {
  const { level, module: moduleSlug } = await params;
  const course = getCourse(level);
  const moduleNumber = Number(moduleSlug);
  const courseModule = modules[moduleNumber - 1];

  if (!course || !courseModule) notFound();

  return <ModuleLessons level={course.level} courseTitle={course.title} moduleNumber={moduleNumber} courseModule={courseModule} />;
}