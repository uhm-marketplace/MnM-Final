/* eslint-disable import/extensions */

'use client';

import { Card, Col } from 'react-bootstrap';
import TooltipImage from '@/components/TooltipImage';
import { ProductCardData } from '@/lib/ProductCardData';

const ProductCard = ({ product }: { product: ProductCardData }) => (
  <Col>
    <Card className="h-100">
      <Card.Body>
        <Card.Img src={product.picture || ''} width={50} />
        <Card.Title style={{ marginTop: '0px' }}>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
      </Card.Body>
      <Card.Body>
        {product.owner && (
          <TooltipImage
            className="mx-1"
            key={product.owner}
            name={product.owner}
            roundedCircle
            src={product.picture || ''}
            width={50}
          />
        )}
      </Card.Body>
    </Card>
  </Col>
);

export default ProductCard;
