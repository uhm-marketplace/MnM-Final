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
    price: 15.20,
    image: '/images/planner.jpg',
    category: 'Stationery',
  },
  {
    id: 2,
    name: 'Highlighters Set',
    description: 'A pack of various sized multi-colored highlighters that will help students with note-taking.',
    price: 10.25,
    image: '/images/headphones.jpg',
    category: 'Stationery',
  },
  {
    id: 3,
    name: 'Japanese 101',
    description: 'A workbook to help student understand Hiragana, Katakana and Kanji.',
    price: 20.00,
    image: '/images/workbook.jpg',
    category: 'Textbooks',
  },
  {
    id: 4,
    name: 'Leaflet Notebook',
    description: 'Write down important ideas or sketch within this lightweight portable notebook.',
    price: 15.00,
    image: '/images/laptop-stand.jpg',
    category: 'Notebooks',
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
    name: 'Dictionary',
    description: 'A refrence book that helps with understanding Engllish by provides meanings, pronunciations and etc.',
    price: 10.00,
    image: '/images/whiteboard.jpg',
    category: 'Reference Tools',
  },
  {
    id: 7,
    name: 'A Christmas Carol',
    description: 'The classic novella written by Charles Dickens that tells the story of Ebenezer Scrooge.'
    + 'a miser who is transofmred by three ghosts, learning the value of kindness and generosity',
    price: 5.00,
    image: '/images/whiteboard.jpg',
    category: 'Books',
  },
];

const CampusClosetPage: React.FC = () => {
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
              className={`list-group-item list-group-item-action ${selectedCategory === 'Notebooks' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('Notebooks')}
              type="button"
            >
              Notebooks
            </button>
            <button
              className={
                `list-group-item list-group-item-action ${selectedCategory === 'Textbooks' ? 'active' : ''}`
              }
              onClick={() => handleCategoryChange('Textbooks')}
              type="button"
            >
              Textbooks
            </button>
            <button
              className={
                `list-group-item list-group-item-action ${selectedCategory === 'Books' ? 'active' : ''}`
              }
              onClick={() => handleCategoryChange('Books')}
              type="button"
            >
              Books
            </button>
            <button
              className={`list-group-item list-group-item-action ${selectedCategory === 'Stationery' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('Stationery')}
              type="button"
            >
              Stationery
            </button>
            <button
              className={
                `list-group-item list-group-item-action ${selectedCategory === 'Reference Tools' ? 'active' : ''}`
              }
              onClick={() => handleCategoryChange('Reference Tools')}
              type="button"
            >
              Reference Tools
            </button>
          </div>
        </Col>

        <Col md={9}>
          <h2 className="mb-4">Campus Closet</h2>

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

export default CampusClosetPage;
