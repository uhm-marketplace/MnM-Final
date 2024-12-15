/* eslint-disable react/no-array-index-key */
import { getServerSession } from 'next-auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ListProducts from './ListProducts';
import SearchProducts from './SearchProducts';

const ProductsPage = async ({ searchParams }: { searchParams?: { query?: string } }) => {
  const session = await getServerSession(authOptions);

  loggedInProtectedPage(session as { user: { email: string; id: string; randomKey: string } } | null);

  const query = searchParams?.query || '';

  const projects = await prisma.project.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
  });

  console.log('Generated keys:', projects.map((project, index) => `project-${project.id}-${project.name}-${index}`));

  const uniqueProjects = new Set(projects.map((project) => `project-${project.id}-${project.name}`));
  if (uniqueProjects.size !== projects.length) {
    console.error('Duplicate projects detected in the database.');
  }

  return (
<<<<<<< HEAD
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {projects.map((project, index) => (
          // Combining id, name, and index for a guaranteed unique key
          <ProjectCardHelper key={`project-${project.id}-${project.name}-${index}`} project={project} />
        ))}
      </Row>
    </Container>
=======
    <div>
      <h2 className="text-2xl font-semibold border-l-4 pl-4 border-gray-300">Search the UHM Way</h2>

      <SearchProducts />
      <ListProducts query={query} projects={projects} />
    </div>
>>>>>>> main
  );
};

ProductsPage.defaultProps = {
  searchParams: { query: '' },
};

export default ProductsPage;
