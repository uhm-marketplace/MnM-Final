/* eslint-disable react/no-array-index-key */
import { getServerSession } from 'next-auth';
import { Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import pageStyle from '@/utilities/pageStyle';
import { authOptions } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import ProjectCardHelper from './ProjectCardHelper';

const ProjectsPage = async () => {
  const session = await getServerSession(authOptions);

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const projects = await prisma.project.findMany();
  projects.sort((a, b) => a.name.localeCompare(b.name));

  console.log('Generated keys:', projects.map((project, index) => `project-${project.id}-${project.name}-${index}`));

  const uniqueProjects = new Set(projects.map((project) => `project-${project.id}-${project.name}`));
  if (uniqueProjects.size !== projects.length) {
    console.error('Duplicate projects detected in the database.');
  }

  return (
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {projects.map((project, index) => (
          // Combining id, name, and index for a guaranteed unique key
          <ProjectCardHelper key={`project-${project.id}-${project.name}-${index}`} project={project} />
        ))}
      </Row>
    </Container>
  );
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default ProjectsPage;
