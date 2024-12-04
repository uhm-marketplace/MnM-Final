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
    name: 'UHM Hoodie',
    description: 'A grey hoodie that is ideal for chilly classrooms or outdoor activities.',
    price: 20.50,
    image: '/images/planner.jpg',
    category: 'Everyday Wear',
  },
  {
    id: 2,
    name: 'UHM Baseball Cap',
    description: 'Stylish and suitable for hot weather.',
    price: 10.25,
    image: '/images/headphones.jpg',
    category: 'Accessories',
  },
  {
    id: 3,
    name: 'Compression Socks',
    description: 'Special socks designed to improve circulation and reduce muscle fatigue.',
    price: 20.00,
    image: '/images/workbook.jpg',
    category: 'Activewear',
  },
  {
    id: 4,
    name: 'Traditional Graduation Cap & Gown',
    description: 'The classic cap and gown set made of lightweight polyester that is adjustable along'
    + 'with a cap and tassel.',
    price: 120.00,
    image: '/images/laptop-stand.jpg',
    category: 'Graduation Apparel',
  },
  {
    id: 5,
    name: 'Mini Umbrella',
    description: 'Useful for unexpected rain showers on campus.',
    price: 10.99,
    image: '/images/study-guide.jpg',
    category: 'Miscellaneous',
  },
  {
    id: 6,
    name: 'Honor Cords',
    description: 'Worn as a symbol of academic achievement as students wear them to ditinguish themselves.',
    price: 10.00,
    image: '/images/whiteboard.jpg',
    category: 'Graduation Apparel',
  },
  {
    id: 7,
    name: 'UHM Gym Bag',
    description: 'A UHM bag designed to carry gym essentials such as clothes, shows, water bottles and towels',
    price: 45.00,
    image: '/images/whiteboard.jpg',
    category: 'Activewear',
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
              className={`list-group-item list-group-item-action ${selectedCategory === 'Everyday Wear' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('Everyday Wear')}
              type="button"
            >
              Everyday Wear
            </button>
            <button
              className={
                `list-group-item list-group-item-action ${selectedCategory === 'Accessories' ? 'active' : ''}`
              }
              onClick={() => handleCategoryChange('Accessories')}
              type="button"
            >
              Accessories
            </button>
            <button
              className={
                `list-group-item list-group-item-action ${selectedCategory === 'Activewear' ? 'active' : ''}`
              }
              onClick={() => handleCategoryChange('Activewear')}
              type="button"
            >
              Activewear
            </button>
            <button
              className={`list-group-item list-group-item-action ${selectedCategory === 'Graduation Apparel' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('Graduation Apparel')}
              type="button"
            >
              Graduation Apparel
            </button>
            <button
              className={
                `list-group-item list-group-item-action ${selectedCategory === 'Miscellaneous' ? 'active' : ''}`
              }
              onClick={() => handleCategoryChange('Miscellaneous')}
              type="button"
            >
              Miscellaneous
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
