// ProjectCardHelper.tsx
import { Project } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ProjectCardData } from '@/lib/ProjectCardData';
import ProjectCardWithCart from './ProjectCardWithCart';

// Extend the Project type to include ownerId
type ExtendedProject = Project & { ownerId?: number };

// Keep this as an async server component
const ProjectCardHelper = async ({ project }: { project: ExtendedProject }) => {
  // Fetch all related data in parallel for better performance
  const [projectInterests, projectParticipants, buyers] = await Promise.all([
    prisma.projectInterest.findMany({
      where: { projectId: project.id },
      include: { interest: true }, // Include interest data directly
    }),
    prisma.profileProject.findMany({
      where: { projectId: project.id },
      include: { profile: true },
    }),
    prisma.projectBuyer.findMany({
      where: { projectId: project.id },
      include: { profile: true },
    }),
  ]);

  const projectData: ProjectCardData = {
    id: project.id,
    name: project.name,
    homepage: project.homepage,
    picture: project.picture,
    price: project.price,
    description: project.description,
    interests: projectInterests.map((pi) => pi.interest.name),
    participants: projectParticipants.map((pp) => pp.profile),
    buyers: buyers.map((b) => b.profile),
    ownerId: project.ownerId ?? 0, // Populate ownerId with a fallback
    productId: project.id, // Assign productId if it represents the project ID
  };

  console.log('Constructed projectData:', projectData);

  return <ProjectCardWithCart projectData={projectData} />;
};

export default ProjectCardHelper;
