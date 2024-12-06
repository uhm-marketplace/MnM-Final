/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const profileInterests = await prisma.profileInterest.findMany({
    where: { profileId: Number(params.id) },
  });
  const interests = await prisma.interest.findMany({
    where: { id: { in: profileInterests.map((pi) => pi.interestId) } },
  });
  const interestNames = interests.map((interest) => interest.name);

  const profileProjects = await prisma.profileProject.findMany({
    where: { profileId: Number(params.id) },
  });
  const projects = await prisma.project.findMany({
    where: { id: { in: profileProjects.map((pp) => pp.projectId) } },
  });

  const profile = await prisma.profile.findUnique({
    where: { id: Number(params.id) },
  });

  const profileData = {
    firstName: profile?.firstName,
    lastName: profile?.lastName,
    email: profile?.email,
    bio: profile?.bio,
    title: profile?.title,
    picture: profile?.picture,
    interests: interestNames,
    projects,
  };

  return NextResponse.json(profileData);
}
