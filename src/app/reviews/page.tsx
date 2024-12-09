'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { Form, Row, Col, Button, ListGroup, Container, Card } from 'react-bootstrap';
import { ReviewSchema, IReview } from '@/lib/validationSchemas';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} style={{ color: index < rating ? '#ffc107' : '#e4e5e9' }}>
      &#9733;
    </span>
  ));
  return <div>{stars}</div>;
};

const ReviewsPage = () => {
  const { data: session } = useSession();
  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(ReviewSchema),
  });

  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<IReview[]>([]);

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

      const profileId = session?.user?.id;

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
    <Container className="my-4">
      <h1>Reviews</h1>
      <Card className="my-3">
        <Card.Body>
          <Card.Title> Product Reviews</Card.Title>

          <ListGroup className="mb-3">
            {reviews.map((review) => (
              <ListGroup.Item key={review.id}>
                <Row>
                  <Col>
                    <p>{new Date(review.createdAt).toLocaleString()}</p>
                    <strong>{review.userName}</strong>
                    <p>
                      reviewed
                      {' '}
                      <em>{review.item}</em>
                    </p>
                  </Col>
                  <Col className="text-end">
                    <StarRating rating={review.rating || 0} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <p>{review.reviewText}</p>
                    <small className="text-muted">
                      Contact:
                      {' '}
                      {review.contact}
                    </small>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formUserName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('userName')}
                    value={watch('userName') || ''}
                    isInvalid={!!errors.userName}
                    placeholder="Enter your name"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formItemName">
                  <Form.Label>Item</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('item')}
                    value={watch('item') || ''}
                    isInvalid={!!errors.item}
                    placeholder="Enter item name"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formRating">
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
                        value={field.value || ''}
                        isInvalid={!!errors.rating}
                        placeholder="Rate between 1 to 5"
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formContact">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    {...register('contact')}
                    value={watch('contact') || ''}
                    isInvalid={!!errors.contact}
                    placeholder="Enter your email"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formReviewText">
              <Form.Label>Review</Form.Label>
              <Form.Control
                type="text"
                {...register('reviewText')}
                value={watch('reviewText') || ''}
                isInvalid={!!errors.reviewText}
                placeholder="Write your review here"
              />
            </Form.Group>
            <Button variant="primary" disabled={loading} type="submit">
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReviewsPage;
