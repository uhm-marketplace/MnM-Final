'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import swal from 'sweetalert';
import { Form, Row, Col, Button, ListGroup, Container } from 'react-bootstrap';

// Define the type for review data
interface Review {
  createdAt: string | number | Date;
  id: number;
  userName: string;
  item: string;
  rating: number | null;
  contact: string;
  reviewText: string;
  profileId?: number;
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

const ReviewsPage = () => {
  const { data: session } = useSession();
  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(ReviewSchema),
  });

  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        console.log('Fetch response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error fetching reviews:', errorText);
          throw new Error(errorText || 'Failed to fetch reviews');
        }

        const data = await response.json();
        console.log('Fetched reviews:', data);
        setReviews(data);
      } catch (error) {
        console.error('Error in fetchReviews:', (error as Error).message);
      }
    };

    fetchReviews();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const profileId = session?.user?.id ? parseInt(session.user.id, 10) : null; // Ensure profileId is an integer

      const payload = { ...data, profileId };

      console.log('Submitting payload:', payload);

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(errorText || 'An error occurred while submitting the review.');
      }

      const responseData = await response.json();
      console.log('Review submitted successfully:', responseData);
      swal('Success', 'Review submitted successfully!', 'success');
      reset();

      setReviews((prevReviews) => [...prevReviews, responseData]);
    } catch (error) {
      console.error('Error submitting review:', (error as Error).message);
      swal('Error', (error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                {...register('userName')}
                value={watch('userName') || ''} // Controlled input
                isInvalid={!!errors.userName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.userName?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Item</Form.Label>
              <Form.Control
                type="text"
                {...register('item')}
                value={watch('item') || ''} // Controlled input
                isInvalid={!!errors.item}
              />
              <Form.Control.Feedback type="invalid">
                {errors.item?.message}
              </Form.Control.Feedback>
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
                    value={field.value || ''} // Controlled input
                    isInvalid={!!errors.rating}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.rating?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                {...register('contact')}
                value={watch('contact') || ''} // Controlled input
                isInvalid={!!errors.contact}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contact?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Review</Form.Label>
          <Form.Control
            type="text"
            {...register('reviewText')}
            value={watch('reviewText') || ''} // Controlled input
            isInvalid={!!errors.reviewText}
          />
          <Form.Control.Feedback type="invalid">
            {errors.reviewText?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button disabled={loading} type="submit">
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Form>

      <h2 className="mt-5">Stored Reviews</h2>
      <ListGroup>
        {reviews.map((review) => (
          <ListGroup.Item key={review.id}>
            <p>
              {new Date(review.createdAt).toLocaleString()}
            </p>
            <h5>{review.userName}</h5>
            <p>
              <strong>Item:</strong>
              {' '}
              {review.item}
            </p>
            <p>
              <strong>Rating:</strong>
              {' '}
              {review.rating || 'N/A'}
            </p>
            <p>
              <strong>Review:</strong>
              {' '}
              {review.reviewText}
            </p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default ReviewsPage;
