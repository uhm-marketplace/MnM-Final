/* eslint-disable import/extensions */
import { Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import pageStyle from '@/utilities/pageStyle';
import ProductCardHelper from './ProductCardHelper';

const ProductsPage = async () => {
  const products = await prisma.product.findMany();
  products.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {products.map((product) => (
          <ProductCardHelper key={product.id} product={product} />
        ))}
      </Row>
    </Container>
  );
};

export default ProductsPage;