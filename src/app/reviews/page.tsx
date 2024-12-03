'use client';

import React, { useState } from 'react';
import { Card, Button, Form, ListGroup, Row, Col, Container } from 'react-bootstrap';

// Mock Data for Initial Reviews
const initialReviews = [
  {
    id: 1,
    userName: 'Jane Doe',
    item: 'Wireless Earbuds',
    rating: 4,
    contact: 'jane.doe@example.com',
    reviewText: 'Great sound quality, but the battery could last longer.',
  },
  {
    id: 2,
    userName: 'John Smith',
    item: 'Laptop Stand',
    rating: 5,
    contact: 'john.smith@example.com',
    reviewText: 'Sturdy and ergonomic. A must-have for remote work!',
  },
];

const ReviewPage: React.FC = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [formData, setFormData] = useState({
    userName: '',
    item: '',
    rating: 0,
    contact: '',
    reviewText: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview = {
      ...formData,
      id: reviews.length + 1,
      rating: parseInt(formData.rating as unknown as string, 10),
    };
    setReviews([...reviews, newReview]);
    setFormData({
      userName: '',
      item: '',
      rating: 0,
      contact: '',
      reviewText: '',
    });
  };

  return (
    <Container className="my-4">
      <h1>Reviews</h1>
      <Card className="my-3">
        <Card.Body>
          <Card.Title>Product Reviews</Card.Title>

          {/* Display Reviews */}
          <ListGroup className="mb-3">
            {reviews.map((review) => (
              <ListGroup.Item key={review.id}>
                <Row>
                  <Col>
                    <strong>{review.userName}</strong> reviewed <em>{review.item}</em>
                  </Col>
                  <Col className="text-end">
                    <span>{'⭐'.repeat(review.rating)}</span>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <p>{review.reviewText}</p>
                    <small className="text-muted">Contact: {review.contact}</small>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Add Review Form */}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formUserName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formItemName">
                  <Form.Label>Item</Form.Label>
                  <Form.Control
                    type="text"
                    name="item"
                    value={formData.item}
                    onChange={handleChange}
                    required
                    placeholder="Enter item name"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formRating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                    placeholder="Rate out of 5"
                    min={1}
                    max={5}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formContact">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="email"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formReviewText">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reviewText"
                value={formData.reviewText}
                onChange={handleChange}
                required
                placeholder="Write your review here"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReviewPage;