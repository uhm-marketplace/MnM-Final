/* eslint-disable no-await-in-loop */
import { getServerSession } from 'next-auth';
import { Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import pageStyle from '@/utilities/pageStyle';
import { authOptions } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import ProjectCardHelper from '../products/ProjectCardHelper';

const SelfCarePage = async () => {
  const session = await getServerSession(authOptions);

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const allProjects = await prisma.project.findMany();
  const projectsWithStudyTools = [];

  for (const project of allProjects) {
    const projectInterests = await prisma.projectInterest.findMany({
      where: { projectId: project.id },
    });

    const interests = await prisma.interest.findMany({
      where: { id: { in: projectInterests.map((pi) => pi.interestId) } },
    });

    if (interests.some(interest => interest.name === 'Self-Care')) {
      projectsWithStudyTools.push(project);
    }
  }

  projectsWithStudyTools.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {projectsWithStudyTools.map((project) => (
          <ProjectCardHelper key={`project-${project.id}`} project={project} />
        ))}
      </Row>
    </Container>
  );
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default SelfCarePage;
