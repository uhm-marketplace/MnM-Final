import { getServerSession } from 'next-auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import ListProducts from './ListProducts'; // Ensure ListProducts is imported
import SearchProducts from './SearchProducts'; // Ensure SearchProducts is imported
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma'; // Assuming you're using Prisma correctly

const ProductsPage = async ({ searchParams }: { searchParams?: { query?: string } }) => {
  // Retrieve the session on the server side
  const session = await getServerSession(authOptions);

  // Call the loggedInProtectedPage function to enforce authentication
  loggedInProtectedPage(session as { user: { email: string; id: string; randomKey: string } } | null);

  // Extract the search query from the search parameters
  const query = searchParams?.query || '';

  // Fetch the list of projects (products) based on the search query
  const projects = await prisma.project.findMany({  // Changed 'product' to 'project'
    where: {
      name: {
        contains: query,
        mode: 'insensitive',  // Make the search case-insensitive
      },
    },
  });

  // Render the page with ListProducts, passing session, projects, and query as props
  return (
    <div>
      <h1>Search Products:</h1>
      <SearchProducts />
      <ListProducts query={query} session={session} projects={projects} /> {/* Pass all required props */}
    </div>
  );
};

export default ProductsPage;
