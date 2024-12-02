import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  config.defaultAccounts.forEach(async (account) => {
    let role: Role = 'USER';
    if (account.role === 'ADMIN') {
      role = 'ADMIN';
    }
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  });
  config.defaultProducts.forEach(async (product, index) => {
    console.log(`  Creating/Updating product ${product.name}`);
    await prisma.product.upsert({
      where: { id: index },
      update: {},
      create: {
        name: product.name,
        price: product.price,
        description: product.description,
        owner: product.owner,
      },
    });
  });
  config.defaultProjects.forEach(async (project) => {
    console.log(`  Creating/Updating project ${project.name}`);
    project.interests.forEach(async (interest) => {
      // console.log(`Project ${project.name} ${interest}`);
      await prisma.interest.upsert({
        where: { name: interest },
        update: {},
        create: { name: interest },
      });
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
      project.interests.forEach(async (intere) => {
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
    });
  });
  config.defaultProfiles.forEach(async (profile) => {
    console.log(`Creating/Updating profile ${profile.email}`);
    // upsert interests from the profile
    profile.interests.forEach(async (interest) => {
      await prisma.interest.upsert({
        where: { name: interest },
        update: {},
        create: { name: interest },
      });
    });
    // Upsert/Create the user so they can login.
    await prisma.user.upsert({
      where: { email: profile.email },
      update: {},
      create: {
        email: profile.email,
        password,
      },
    });
    // Upsert/Create the profile.
    const dbProfile = await prisma.profile.upsert({
      where: { email: profile.email },
      update: {},
      create: {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        picture: profile.picture,
      },
    });
    profile.interests.forEach(async (interest) => {
      const dbInterest = await prisma.interest.findUnique({
        where: { name: interest },
      });
      // console.log(`${dbProfile.firstName} ${dbInterest!.name}`);
      const dbProfileInterest = await prisma.profileInterest.findMany({
        where: { profileId: dbProfile.id, interestId: dbInterest!.id },
      });
      if (dbProfileInterest.length === 0) {
        // Create the profile interest
        await prisma.profileInterest.create({
          data: {
            profileId: dbProfile.id,
            interestId: dbInterest!.id,
          },
        });
      }
    });
    // Upsert/Create the profile projects
    // Upsert/Create the profile projects
    await Promise.all(
      profile.projects.map(async (project) => {
        const dbProject = await prisma.project.findFirst({
          where: { name: project },
        });

        // Guard clause - if no project found, skip this iteration
        if (!dbProject) {
          console.log(
            `Project "${project}" not found in database, skipping...`,
          );
          return;
        }

        const dbProfileProject = await prisma.profileProject.findMany({
          where: {
            profileId: dbProfile.id,
            projectId: dbProject.id,
          },
        });

        if (dbProfileProject.length === 0) {
          // Create the profile project
          await prisma.profileProject.create({
            data: {
              profileId: dbProfile.id,
              projectId: dbProject.id,
            },
          });
        }
      }),
    );
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
