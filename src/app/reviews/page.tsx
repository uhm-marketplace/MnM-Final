'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { AxiosError, ErrorResponse } from 'axios';
import swal from 'sweetalert';
import { Card, Form, Row, Col, Button, ListGroup, Container } from 'react-bootstrap';

// Define the type for response data
interface ReviewResponse {
  id: number;
  userName: string;
  item: string;
  rating: number | null;
  contact: string;
  reviewText: string;
}

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
// const initialReviews = [
//   {
//     id: 1,
//     userName: 'Jane Doe',
//     item: 'Wireless Earbuds',
//     rating: 4,
//     contact: 'jane.doe@example.com',
//     reviewText: 'Great sound quality, but the battery could last longer.',
//   },
//   {
//     id: 2,
//     userName: 'John Smith',
//     item: 'Laptop Stand',
//     rating: 5,
//     contact: 'john.smith@example.com',
//     reviewText: 'Sturdy and ergonomic. A must-have for remote work!',
//   },
// ];

export default function ReviewsPage() {
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(ReviewSchema),
  });
  const [loading, setLoading] = useState(false);
  const [responseReview, setResponseReview] = useState<ReviewResponse | null>(null);

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const profileId = 1; // Replace with dynamic fetching logic for the user's profileId

      const response = await axios.post('/api/reviews', {
        ...data,
        profileId,
      });

      setResponseReview(response.data); // Store the response data
      swal('Success', 'Review submitted successfully!', 'success');
      reset();
    } catch (error) {
    // Explicitly check if error is an AxiosError
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>; // Type the Axios error
        const errorMessage = axiosError.response?.data?.error || axiosError.message;
        console.error('Error submitting review:', errorMessage);
        swal('Error', errorMessage, 'error');
      } else {
      // Handle non-Axios errors
        console.error('Unexpected error:', error);
        swal('Error', 'An unexpected error occurred', 'error');
      }
    } finally {
      setLoading(false);
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
                  <Controller
                    name="userName"
                    control={control}
                    render={({ field }) => <input placeholder="Enter your name" {...field} />}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="item">
                  <Form.Label>Item</Form.Label>
                  <Controller
                    name="item"
                    control={control}
                    render={({ field }) => <input placeholder="Enter item name" {...field} />}
                  />
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
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="contact">
                  <Form.Label>Email</Form.Label>
                  <Controller
                    name="contact"
                    control={control}
                    render={({ field }) => <input placeholder="Enter your email" {...field} />}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="reviewText">
              <Form.Label>Review</Form.Label>
              <Controller
                name="reviewText"
                control={control}
                render={({ field }) => <input placeholder="Write your review here" {...field} />}
              />
            </Form.Group>
            <Button disabled={loading} type="submit">
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ListGroup>
        {/* Display the response data if available */}
        {responseReview && (
        <ListGroup.Item>
          <h5>{responseReview.userName}</h5>
          <p>
            <strong>Item:</strong>
            {responseReview.item}
          </p>
          <p>
            <strong>Rating:</strong>
            {responseReview.rating}
          </p>
          <p>
            <strong>Contact:</strong>
            {responseReview.contact}
          </p>
          <p>{responseReview.reviewText}</p>
        </ListGroup.Item>
        )}
      </ListGroup>
    </Container>
  );
}
