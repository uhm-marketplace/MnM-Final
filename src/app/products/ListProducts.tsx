import { prisma } from '@/lib/prisma';
import { Container, Row } from 'react-bootstrap';
import { PageIDs } from '@/utilities/ids';
import pageStyle from '@/utilities/pageStyle';
import ProjectCardHelper from './ProjectCardHelper';

interface Project {
  id: number;
  name: string;
  picture: string | null;
  homepage: string | null;
  description: string | null;
  price: number;
}

const ListProducts = async ({ query }: { query: string }) => {
  const projects = await prisma.project.findMany();

  // Apply filtering if the query exists
  const filteredProjects = query
    ? projects.filter((project) =>
        project.name.toLowerCase().includes(query.toLowerCase())
      )
    : projects;

  filteredProjects.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {filteredProjects.map((project) => (
          <ProjectCardHelper key={project.id} project={project} />
        ))}
      </Row>
    </Container>
  );
};

export default ListProducts;
