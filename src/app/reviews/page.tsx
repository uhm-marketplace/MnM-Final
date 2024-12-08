'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import swal from 'sweetalert';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';

// Define the type for response data
// interface ReviewResponse {
//   id: number;
//   userName: string;
//   item: string;
//   rating: number | null;
//   contact: string;
//   reviewText: string;
// }

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

const ReviewsPage = () => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(ReviewSchema),
  });

  const [loading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Server error response:', errorMessage);
        throw new Error(errorMessage || `Failed to submit review: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Review submitted successfully:', responseData);
      swal('Success', 'Review submitted successfully!', 'success');
      reset();
    } catch (error) {
      console.error('Error submitting review:', (error as Error).message);
      swal('Error', (error as Error).message, 'error');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" {...register('userName')} isInvalid={!!errors.userName} />
              <Form.Control.Feedback type="invalid">{errors.userName?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Item</Form.Label>
              <Form.Control type="text" {...register('item')} isInvalid={!!errors.item} />
              <Form.Control.Feedback type="invalid">{errors.item?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    type="number"
                    min="1"
                    max="5"
                    {...field}
                    isInvalid={!!errors.rating}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">{errors.rating?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" {...register('contact')} isInvalid={!!errors.contact} />
              <Form.Control.Feedback type="invalid">{errors.contact?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Review</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            {...register('reviewText')}
            isInvalid={!!errors.reviewText}
          />
          <Form.Control.Feedback type="invalid">{errors.reviewText?.message}</Form.Control.Feedback>
        </Form.Group>

        <Button disabled={loading} type="submit">
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Form>
    </Container>
  );
};

export default ReviewsPage;
