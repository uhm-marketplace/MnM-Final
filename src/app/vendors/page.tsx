/* eslint-disable import/extensions */
import { getServerSession } from 'next-auth';
import { Container } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import FilterProfileForm from '@/components/FilterProfileForm';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { authOptions } from '@/lib/auth';

const FilterPage = async () => {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );
  const allInterests = await prisma.interest.findMany();
  const allProfiles = await prisma.profile.findMany();
  const allProfileInterests = await prisma.profileInterest.findMany();
  const allProjects = await prisma.project.findMany();
  const allProfileProjects = await prisma.profileProject.findMany();
  return (
    <Container>
      <h1 className="text-center mt-5">Find Vendors Who Share Your Interests</h1>
      <FilterProfileForm
        interests={allInterests}
        profiles={allProfiles}
        profileInterests={allProfileInterests}
        profileProjects={allProfileProjects}
        projects={allProjects}
      />
    </Container>
  );
};
export default FilterPage;
