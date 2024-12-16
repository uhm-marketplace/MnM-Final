'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

interface Product {
  name: string;
  description: string;
  price: number;
}

const EditProduct: React.FC = () => {
  const { status } = useSession();
  const [routerLoaded, setRouterLoaded] = useState(false); // State to track if the router has loaded
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get('productId'); // Get product ID from the URL (e.g., /edit-product?productId=123)

  useEffect(() => {
    // Ensure that the router is available before accessing it
    if (typeof window !== 'undefined') {
      setRouterLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && productId && routerLoaded) {
      setLoading(true);

      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${productId}`);
          if (response.ok) {
            const data: Product = await response.json();
            setProduct(data);
            setLoading(false);
          } else {
            setError('Product not found or you are not authorized to edit it.');
            setLoading(false);
          }
        } catch (err) {
          setError('An error occurred while fetching the product.');
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [status, productId, routerLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: product.price,
        }),
      });

      if (response.ok) {
        router.push('/account');
      } else {
        setError('Failed to update the product. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating the product.');
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <h2>Edit Product</h2>

      {product && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formProductName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="formProductDescription" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="formProductPrice" className="mt-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Update Product
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default EditProduct;
