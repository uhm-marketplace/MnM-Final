/* eslint-disable import/extensions */
import { Container, Row, Form } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import pageStyle from '@/utilities/pageStyle';
import ProjectCardHelper from './ProjectCardHelper';

const ProjectsPage = async () => {
  const projects = await prisma.project.findMany();
  projects.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      {/* Mock Search Bar (Not Functional) */}
      <Form.Control
        type="text"
        placeholder="Search projects by name..." // Placeholder text for design
        readOnly // Makes the input non-editable, simulating a mock behavior
        className="mb-3" // Adds margin to the bottom for spacing
      />

      {/* Projects Grid */}
      <Row xs={1} md={2} lg={4} className="g-2">
        {projects.map((project) => (
          <ProjectCardHelper key={project.id} project={project} />
        ))}
      </Row>
    </Container>
  );
};

export default ProjectsPage;
