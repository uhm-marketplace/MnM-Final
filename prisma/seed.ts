import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');

  const password = await hash('foo', 10);

  // Seeding default profiles
  const dbProfiles = await Promise.all(
    config.defaultProjects.map(async (profile) => {
      return prisma.profile.upsert({
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
    })
  );

  // Seeding default projects
  const projectPromises = config.defaultProjects.map(async (project) => {
    console.log(`Creating/Updating project ${project.name}`);
  // Seeding default projects
  const projectPromises = config.defaultProjects.map(async (project) => {
    console.log(`Creating/Updating project ${project.name}`);

    const buyer = dbProfiles[Math.floor(Math.random() * dbProfiles.length)];
    const seller = dbProfiles[Math.floor(Math.random() * dbProfiles.length)];

    return prisma.project.upsert({
      where: { name: project.name },
      update: {},
      create: {
        name: project.name,
        description: project.description,
        homepage: project.homepage,
        picture: project.picture,
        price: project.price ?? 0.0, // if price is not specified it will be 0.0
        buyerId: buyer.id,
        sellerId: seller.id,
      },
    });
  });

  await Promise.all(projectPromises);
}
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
