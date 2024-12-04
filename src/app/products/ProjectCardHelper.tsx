// ProjectCardHelper.tsx
import { Project } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ProjectCardData } from '@/lib/ProjectCardData';
import ProjectCardWithCart from './ProjectCardWithCart';

const ProjectCardHelper = async ({ project }: { project: Project }) => {
  const projectInterests = await prisma.projectInterest.findMany({
    where: { projectId: project.id },
  });

  const interests = await prisma.interest.findMany({
    where: {
      id: { in: projectInterests.map((pi) => pi.interestId) },
    },
  });

  const interestNames = interests.map((interest) => interest.name);

  const projectParticipants = await prisma.profileProject.findMany({
    where: { projectId: project.id },
    include: { profile: true },
  });

  const buyers = await prisma.projectBuyer.findMany({
    where: { projectId: project.id },
    include: { profile: true },
  });

  const projectData: ProjectCardData = {
    id: project.id,
    name: project.name,
    homepage: project.homepage,
    picture: project.picture,
    price: project.price,
    description: project.description,
    interests: interestNames,
    participants: projectParticipants.map((pp) => pp.profile),
    buyers: buyers.map((b) => b.profile),
  };

  return <ProjectCardWithCart projectData={projectData} />;
};

export default ProjectCardHelper;
