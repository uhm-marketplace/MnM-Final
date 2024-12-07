'use server';

import { prisma } from '@/lib/prisma';

export async function getProfiles() {
  const profiles = await prisma.profile.findMany();
  return profiles.sort((a, b) => a.email.localeCompare(b.email));
}

export async function getProfileData(profileId: number) {
  const [profile, profileInterests, profileProjects] = await Promise.all([
    prisma.profile.findUnique({ where: { id: profileId } }),
    prisma.profileInterest.findMany({
      where: { profileId },
      include: { interest: true },
    }),
    prisma.profileProject.findMany({
      where: { profileId },
      include: { project: true },
    }),
  ]);

  return {
    ...profile,
    interests: profileInterests.map((pi) => pi.interest.name),
    projects: profileProjects.map((pp) => pp.project),
  };
}
