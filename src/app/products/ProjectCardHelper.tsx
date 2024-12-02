/* eslint-disable import/extensions */
import { Product } from '@prisma/client';
import ProjectCard from '@/components/ProjectCard';
import { prisma } from '@/lib/prisma';
import { ProjectCardData } from '@/lib/ProjectCardData';

const ProductCardHelper = async ({ product }: { product: Product }) => {
  const projectInterests = await prisma.projectInterest.findMany({
    where: { projectId: product.id },
  });
  const reviews = await prisma.review.findMany({
    where: { id: { in: projectInterests.map((projectInterest) => projectInterest.interestId) } },
  });
  const productReviews = reviews.map((review) => review.name);
  const projectParticipants = await prisma.profileProject.findMany({
    where: { projectId: product.id },
  });
  const participants = projectParticipants.map((projectParticipant) => projectParticipant.profileId);
  const profileParticipants = await prisma.profile.findMany({
    where: { id: { in: participants } },
  });
  const productData: ProductCardData = {
    name: product.name,
    picture: product.picture,
    price: product.price,
    description: product.description,
    interests: interestNames,
    participants: profileParticipants,
  };
  return <ProjectCard project={projectData} />;
};

export default ProductCardHelper;
