'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Card,
  Button,
  Form,
  ListGroup,
  Row,
  Col,
  Container,
} from 'react-bootstrap';
import swal from 'sweetalert';

// Form Validation Schema
const ReviewSchema = yup.object().shape({
  userName: yup.string().required('Name is required'),
  item: yup.string().required('Item name is required'),
  rating: yup
    .number()
    .required('Rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  contact: yup.string().email('Invalid email').required('Email is required'),
  reviewText: yup.string().required('Review text is required'),
});

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

const ReviewPage = () => {
  const [reviews, setReviews] = useState(initialReviews);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ReviewSchema),
  });

  // Submission Handler
  const onSubmit = async (data: {
    userName: string;
    item: string;
    rating: number;
    contact: string;
    reviewText: string;
  }) => {
    try {
      // Simmulate sending data to database
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([...reviews, newReview]);
        swal('Success!', 'Review submitted successfully!', 'success');
        reset();
      } else {
        swal('Error!', 'Failed to submit review. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      swal('Error!', 'An unexpected error occured.', 'error');
    }
  };

  return (
    <Container className="my-4">
      <h1>Reviews</h1>
      <Card className="my-3">
        <Card.Body>
          <Card.Title>Product Reviews</Card.Title>
          {/* Add Review Form */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="userName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('userName')}
                    required
                    placeholder="Enter your name"
                    isInvalid={!!errors.userName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.userName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="item">
                  <Form.Label>Item</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('item')}
                    required
                    placeholder="Enter item name"
                    isInvalid={!!errors.item}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.item?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="rating">
                  <Form.Label>Rating</Form.Label>
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        type="number"
                        {...field}
                        placeholder="Rating"
                        isInvalid={!!errors.rating}
                      />
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rating?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="contact">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    {...register('contact')}
                    placeholder="Enter your email"
                    isInvalid={!!errors.contact}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contact?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="reviewText">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                placeholder="Write your review here"
                {...register('reviewText')}
                isInvalid={!!errors.reviewText}
              />
              <Form.Control.Feedback type="invalid">
                {errors.reviewText?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <h2>Customer Reviews</h2>
      <ListGroup>
        {reviews.map((review) => (
          <ListGroup.Item key={review.id}>
            <h5>{review.userName}</h5>
            <p>
              <strong>Item:</strong>
              {' '}
              {review.item}
            </p>
            <p>
              <strong>Rating:</strong>
              {' '}
              {review.rating}
            </p>
            <p>
              <strong>Contact:</strong>
              {' '}
              {review.contact}
            </p>
            <p>{review.reviewText}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default ReviewPage;
