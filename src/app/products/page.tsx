import ListProducts from './ListProducts';
import SearchProducts from './SearchProducts';

const ProjectsPage = ({ searchParams }: { searchParams?: { query?: string } }) => {
  const query = searchParams?.query || '';

  return (
    <div>
      <h1>Search Products:</h1>
      <SearchProducts />
      <ListProducts query={query} />
    </div>
  );
};

export default ProjectsPage;
