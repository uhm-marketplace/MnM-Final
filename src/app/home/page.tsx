import React from 'react';
import { getServerSession } from 'next-auth';
import { Profile, Interest, Project } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { authOptions } from '@/lib/auth';
import HomePage from './HomePage';

const HomePageHelper = async () => {
  const session = await getServerSession(authOptions);

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const email = session?.user?.email || '';
  const [profile, interests, projects] = await Promise.all([
    prisma.profile.findUnique({ where: { email } }),
    prisma.interest.findMany(),
    prisma.project.findMany(),
  ]);

  if (!profile) {
    // If no profile exists, return the HomePage with just the email
    return (
      <HomePage
        profile={{ email } as Profile}
        interests={interests}
        projects={projects}
        profileInterests={[]}
        profileProjects={[]}
        isNewProfile
      />
    );
  }

  // If profile exists, get their interests and projects
  const [profileInterests, profileProjects] = await Promise.all([
    prisma.profileInterest.findMany({
      where: { profileId: profile.id },
    }),
    prisma.profileProject.findMany({
      where: { profileId: profile.id },
    }),
  ]);

  const proInterests: Interest[] = profileInterests
    .map((profileInterest) => interests.find((interest) => interest.id === profileInterest.interestId))
    .filter((interest): interest is Interest => interest !== undefined);

  const proProjects: Project[] = profileProjects
    .map((profileProject) => projects.find((project) => project.id === profileProject.projectId))
    .filter((project): project is Project => project !== undefined);

  return (
    <HomePage
      profile={profile}
      interests={interests}
      projects={projects}
      profileInterests={proInterests}
      profileProjects={proProjects}
      isNewProfile={false}
    />
  );
};

export default HomePageHelper;
