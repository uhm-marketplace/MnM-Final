'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Link from 'next/link';

const ViewAccount: React.FC = () => {
  const [user, setUser] = useState({ email: '', name: '' });
  const [products, setProducts] = useState<{ id: string; name: string; description: string; price: number }[]>([]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch user's products from the database
  const fetchUserProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching user products:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user.email) {
      fetchUserProducts();
    }
  }, [user.email]);

  return (
    <div className="container mt-5">
      <h1>View Account</h1>

      <div className="mb-4">
        {user && (
          <>
            <h3>User Information</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.name}</p>
          </>
        )}
      </div>

      <div>
        <h3>My Products</h3>
        {products.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {products.map((product) => (
              <Col key={product.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <p><strong>Price:</strong> ${product.price}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No products available.</p>
        )}
      </div>

      {/* Redirect to Edit Products Form */}
      <div className="mt-4">
        <Link href="/edit-product" passHref>
          <Button variant="primary">Edit Products</Button>
        </Link>
      </div>
    </div>
  );
};

export default ViewAccount;
