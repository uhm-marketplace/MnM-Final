import { getServerSession } from 'next-auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ListProducts from './ListProducts';
import SearchProducts from './SearchProducts';

const ProductsPage = async ({ searchParams }: { searchParams?: { query?: string } }) => {
  const session = await getServerSession(authOptions);

  // Call the loggedInProtectedPage function to enforce authentication
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

  return (
    <div>
      <h2 className="text-2xl font-semibold border-l-4 pl-4 border-gray-300">Search the UHM Way</h2>

      <SearchProducts />
      <ListProducts query={query} projects={projects} />
    </div>
  );
};

ProductsPage.defaultProps = {
  searchParams: { query: '' },
};

export default ProductsPage;
