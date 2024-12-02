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

// Updated products to reflect study tools
const products: Product[] = [
  {
    id: 1,
    name: 'Study Planner',
    description: 'A comprehensive planner to organize your study schedule and goals.',
    price: 19.99,
    image: '/images/planner.jpg',
    category: 'Books',
  },
  {
    id: 2,
    name: 'Noise Cancelling Headphones',
    description: 'Block out distractions and focus with high-quality noise-cancelling headphones.',
    price: 99.99,
    image: '/images/headphones.jpg',
    category: 'Tech Gadgets',
  },
  {
    id: 3,
    name: 'Mind Maps Workbook',
    description: 'A workbook to help you create effective mind maps for studying and note-taking.',
    price: 15.99,
    image: '/images/workbook.jpg',
    category: 'Books',
  },
  {
    id: 4,
    name: 'Laptop Stand',
    description: 'Ergonomic stand for your laptop to improve posture during long study sessions.',
    price: 29.99,
    image: '/images/laptop-stand.jpg',
    category: 'Tech Gadgets',
  },
  {
    id: 5,
    name: 'Mathematics Study Guide',
    description: 'A complete study guide with practice problems and solutions for mastering math.',
    price: 25.99,
    image: '/images/study-guide.jpg',
    category: 'Books',
  },
  {
    id: 6,
    name: 'Smart Whiteboard',
    description: 'Interactive whiteboard for visualizing complex study concepts and diagrams.',
    price: 149.99,
    image: '/images/whiteboard.jpg',
    category: 'Tech Gadgets',
  },
];

const StudyToolsPage: React.FC = () => {
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
              className={`list-group-item list-group-item-action ${selectedCategory === 'Books' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('Books')}
              type="button"
            >
              Books
            </button>
            <button
              className={
                `list-group-item list-group-item-action ${selectedCategory === 'Tech Gadgets' ? 'active' : ''}`
              }
              onClick={() => handleCategoryChange('Tech Gadgets')}
              type="button"
            >
              Tech Gadgets
            </button>
            <button
              className={
                `list-group-item list-group-item-action ${selectedCategory === 'Online Courses' ? 'active' : ''}`
              }
              onClick={() => handleCategoryChange('Online Courses')}
              type="button"
            >
              Online Courses
            </button>
            <button
              className={`list-group-item list-group-item-action ${selectedCategory === 'Stationery' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('Stationery')}
              type="button"
            >
              Stationery
            </button>
          </div>
        </Col>

        <Col md={9}>
          <h2 className="mb-4">Study Tools</h2>

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

export default StudyToolsPage;
