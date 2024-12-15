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

  return (
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {projects.map((project) => (
          // Ensuring a unique key by combining project.id and project.name
          <ProjectCardHelper key={`project-${project.id}-${project.name}`} project={project} />
        ))}
      </Row>
    </Container>
  );
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default ProjectsPage;
