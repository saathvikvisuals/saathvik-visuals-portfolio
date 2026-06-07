import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/portfolio";
import { ProjectCaseStudy } from "@/components/project-case-study";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.name} | Saathvik Visuals Case Study`,
    description: project.outcome
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectCaseStudy project={project} />;
}
