'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Facial Masks',
    description: 'A pack of scented facial masks that hydrate and cleanse the face.',
    price: 10.50,
    image: '/images/planner.jpg',
    category: 'Personal Care & Hygiene',
  },
  {
    id: 2,
    name: 'A Veriety of Teas',
    description: 'Herbal tears flavors such as: chamomile, that encourages relaxation, digestion and overall wellness.',
    price: 20.40,
    image: '/images/headphones.jpg',
    category: 'Health & Wellness',
  },
  {
    id: 3,
    name: 'Eye Cream',
    description: 'Specialized cream that targets the delicate skin around the eyes that reduces dark circles and puffiness.',
    price: 21.00,
    image: '/images/workbook.jpg',
    category: 'Beauty Essentials',
  },
  {
    id: 4,
    name: 'Weighted Plush',
    description: 'A stuffed animal that is filled with weight-desibuting substances in order to provide a therapuetic benefits',
    price: 35.00,
    image: '/images/laptop-stand.jpg',
    category: 'Comfort Zone',
  },
  {
    id: 5,
    name: 'Foam Rollers',
    description: 'A simple tool for relieving muscle tightness, tension and stress.',
    price: 5.99,
    image: '/images/study-guide.jpg',
    category: 'Comfort Zone',
  },
  {
    id: 6,
    name: 'Standard Lip Balm',
    description: 'A soothing product that moisturizes the lips for ten to twelve hours.',
    price: 5.00,
    image: '/images/whiteboard.jpg',
    category: 'Beauty Essentials',
  },
];

const SelfCarePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  // Paginate products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <Container fluid className="py-5">
      <Row>
        <Col md={3} className="mb-4">
          {/* Filter Sidebar */}
          <h4 className="mb-4">Filter by Category</h4>
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('All')}
              type="button"
            >
              All
            </button>
            <button
              className={`list-group-item list-group-item-action ${selectedCategory === 'Personal Care & Hygiene' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('Personal Care & Hygiene')}
              type="button"
            >
              Personal Care & Hygiene
            </button>
            <button
              className={
                `list-group-item list-group-item-action ${selectedCategory === 'Health & Wellness' ? 'active' : ''}`
              }
              onClick={() => handleCategoryChange('Health & Wellness')}
              type="button"
            >
              Health & Wellness
            </button>
            <button
              className={
                `list-group-item list-group-item-action ${selectedCategory === 'Beauty Essentials' ? 'active' : ''}`
              }
              onClick={() => handleCategoryChange('Beauty Essentials')}
              type="button"
            >
              Beauty Essentials
            </button>
            <button
              className={`list-group-item list-group-item-action ${selectedCategory === 'Comfort Zone' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('Comfort Zone')}
              type="button"
            >
              Comfort Zone
            </button>
          </div>
        </Col>

        <Col md={9}>
          <h2 className="mb-4">Self-Care</h2>

          <Row>
            {/* Product Cards */}
            {paginatedProducts.map((product) => (
              <Col sm={12} md={4} key={product.id} className="mb-4">
                <Card className="shadow-sm border-light rounded-lg hover-zoom">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    className="card-img-top rounded-top"
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <div className="mt-3">
                      <h5 className="text-primary">
                        $
                        {product.price.toFixed(2)}
                      </h5>
                    </div>
                    <Link href={`/products/${product.id}`} passHref>
                      <Button variant="primary" className="w-100 rounded-pill">
                        View Details
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index}
                  active={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className="rounded-pill"
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SelfCarePage;
