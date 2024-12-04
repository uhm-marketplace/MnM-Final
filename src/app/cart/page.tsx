'use client';

import { useEffect, useState } from 'react';
import { Container, Table, Button, Image as BsImage } from 'react-bootstrap';
import { ProjectCardData } from '@/lib/ProjectCardData';
import pageStyle from '@/utilities/pageStyle';
import { Trash } from 'react-bootstrap-icons';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<ProjectCardData[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);

    const updateCart = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(updatedCart);
    };

    window.addEventListener('cartUpdated', updateCart);

    return () => {
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  const handleRemoveFromCart = (itemName: string) => {
    const updatedCart = cartItems.filter((item) => item.name !== itemName);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <Container style={pageStyle}>
      <h1 className="mb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h3>Your cart is empty</h3>
        </div>
      ) : (
        <>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Image</th>
                <th>Product</th>
                <th>Description</th>
                <th>Interests</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.name}>
                  <td>
                    {item.picture && (
                      <BsImage
                        src={item.picture}
                        alt={item.name}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                        }}
                        thumbnail
                      />
                    )}
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                    {item.homepage && (
                      <div>
                        <a
                          href={item.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </td>
                  <td>{item.description}</td>
                  <td>{item.interests.join(', ')}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveFromCart(item.name)}
                      className="d-flex align-items-center gap-2"
                    >
                      <Trash size={16} />
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>
              Total Items:
              {cartItems.length}
            </h4>
            <Button
              variant="success"
              size="lg"
              onClick={() => console.log('Proceed to checkout clicked')}
              className="px-4"
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default CartPage;
