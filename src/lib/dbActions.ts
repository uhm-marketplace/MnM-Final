/* eslint-disable no-await-in-loop */

'use server';

import { compare, hash } from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { IProfile } from '@/lib/validationSchemas';
import { prisma } from './prisma';

export async function getUser(email: string) {
  // console.log(`getUser data: ${email}`);
  // eslint-disable-next-line @typescript-eslint/return-await
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function checkPassword(credentials: {
  email: string;
  password: string;
}) {
  // console.log(`checkPassword data: ${JSON.stringify(credentials, null, 2)}`);
  const user = await getUser(credentials.email);
  if (!user) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/return-await
  return await compare(credentials.password, user.password);
}

export async function changePassword(credentials: {
  email: string;
  password: string;
}) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

export async function createUser(credentials: {
  email: string;
  password: string;
}) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

export async function createProject(project: any) {
  // console.log(`createProject data: ${JSON.stringify(project, null, 2)}`);
  const dbProject = await prisma.project.create({
    data: project,
  });
  return dbProject;
}

export async function upsertProject(project: any) {
  // console.log(`upsertProject data: ${JSON.stringify(project, null, 2)}`);
  const dbProject = await prisma.project.upsert({
    where: { name: project.name },
    update: {},
    create: {
      name: project.name,
      description: project.description,
      homepage: project.homepage,
      picture: project.picture,
    },
  });
  project.interests.forEach(async (intere: string) => {
    const dbInterest = await prisma.interest.findUnique({
      where: { name: intere },
    });
    // console.log(`${dbProject.name} ${dbInterest!.name}`);
    const dbProjectInterest = await prisma.projectInterest.findMany({
      where: { projectId: dbProject.id, interestId: dbInterest!.id },
    });
    if (dbProjectInterest.length === 0) {
      await prisma.projectInterest.create({
        data: {
          projectId: dbProject.id,
          interestId: dbInterest!.id,
        },
      });
    }
  });
  project.participants.forEach(async (email: string) => {
    const dbProfile = await prisma.profile.findUnique({
      where: { email },
    });
    const dbProfileProject = await prisma.profileProject.findMany({
      where: { projectId: dbProject.id, profileId: dbProfile!.id },
    });
    if (dbProfileProject.length === 0) {
      await prisma.profileProject.create({
        data: {
          projectId: dbProject.id,
          profileId: dbProfile!.id,
        },
      });
    }
  });
  return dbProject;
}

export async function createProfile(data: IProfile) {
  'use server';

  try {
    const {
      email,
      firstName,
      lastName,
      bio,
      interests = [],
      projects = [],
    } = data;

    // Create the profile
    const profile = await prisma.profile.create({
      data: {
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        bio: bio || null,
      },
    });

    // Create interest relationships
    if (interests.length > 0) {
      const interestRecords = await Promise.all(
        interests.map(async (name) => {
          const interest = await prisma.interest.findUnique({
            where: { name },
          });
          if (interest) {
            return prisma.profileInterest.create({
              data: {
                profileId: profile.id,
                interestId: interest.id,
              },
            });
          }
          return null;
        }),
      );
      await Promise.all(interestRecords.filter(Boolean));
    }

    // Create project relationships
    if (projects.length > 0) {
      const projectRecords = await Promise.all(
        projects.map(async (name) => {
          const project = await prisma.project.findUnique({
            where: { name },
          });
          if (project) {
            return prisma.profileProject.create({
              data: {
                profileId: profile.id,
                projectId: project.id,
              },
            });
          }
          return null;
        }),
      );
      await Promise.all(projectRecords.filter(Boolean));
    }

    revalidatePath('/home');
    return true;
  } catch (error) {
    console.error('Failed to create profile:', error);
    return false;
  }
}

export async function updateProfile(profile: any) {
  console.log(`updateProfile data: ${JSON.stringify(profile, null, 2)}`);
  const dbProfile = await prisma.profile.upsert({
    where: { email: profile.email },
    update: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      picture: profile.picture, // Add picture field to update
    },
    create: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      email: profile.email,
      picture: profile.picture, // Add picture field to create
    },
  });

  if (profile.interests) {
    // Delete all profile interests
    await prisma.profileInterest.deleteMany({
      where: { profileId: dbProfile.id },
    });
    // Add the new profile interests
    for (const intere of profile.interests) {
      const dbInterest = await prisma.interest.findUnique({
        where: { name: intere },
      });
      if (dbInterest) {
        await prisma.profileInterest.create({
          data: {
            profileId: dbProfile.id,
            interestId: dbInterest.id,
          },
        });
      }
    }
  }

  if (profile.projects) {
    // Delete all profile projects
    await prisma.profileProject.deleteMany({
      where: { profileId: dbProfile.id },
    });
    // Add the new profile projects
    for (const projectName of profile.projects) {
      const dbProject = await prisma.project.findUnique({
        where: { name: projectName },
      });
      if (dbProject) {
        await prisma.profileProject.create({
          data: {
            profileId: dbProfile.id,
            projectId: dbProject.id,
          },
        });
      }
    }
  }

  return dbProfile;
}
