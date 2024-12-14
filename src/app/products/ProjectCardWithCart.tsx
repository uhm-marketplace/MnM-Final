'use client';

import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import {
  Cart as CartIcon,
  Heart,
  HeartFill,
  CurrencyDollar,
  Plus,
  Dash,
  ArrowCounterclockwise,
} from 'react-bootstrap-icons';

interface ProjectCardWithCartProps {
  product: {
    id: number;
    name: string;
    price: number;
    ownerId: number;
  };
}

export default function ProjectCardWithCart({ product }: ProjectCardWithCartProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [coinTotal, setCoinTotal] = useState(0); // Total offer in cents
  const quickAmounts = [500, 1000, 2000, 5000]; // Quick amounts in cents
  const coinValues = [1, 5, 10, 25, 50, 100, 200, 500]; // Coin values in cents

  if (!product) {
    return <div>Error: Product data is missing.</div>;
  }

  const { name, price, id, ownerId } = product;

  if (!name || !price || !id || ownerId === undefined) {
    return <div>Error: Product details are incomplete.</div>;
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleModalOpen = () => {
    setShowOfferModal(true);
  };

  const handleModalClose = () => {
    setShowOfferModal(false);
    setCoinTotal(0);
  };

  const handleQuickAmount = (amount: number) => {
    setCoinTotal(amount);
  };

  const handleCoinClick = (value: number) => {
    setCoinTotal((prev) => prev + value);
  };

  const handleReset = () => {
    setCoinTotal(0);
  };

  const getCoinStyle = (value: number) => ({
    bg: value >= 100 ? '#cce5ff' : '#e9ecef',
    color: value >= 100 ? '#004085' : '#6c757d',
  });

  const handleSubmitOffer = async () => {
    try {
      const response = await fetch('/api/bidding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidAmount: coinTotal / 100, // Convert cents to dollars
          productId: product.id,
          ownerId: product.ownerId,
        }),
      });

      if (response.ok) {
        console.log('Offer submitted successfully.');
      } else {
        const errorData = await response.json();
        console.error('Error submitting offer:', errorData.error);
      }
    } catch (error) {
      console.error('Failed to submit offer:', error);
    } finally {
      handleModalClose();
    }
  };

  return (
    <div className="project-card">
      <div className="project-details">
        <h2>{product.name}</h2>
        <p>
          Price: $
          {product.price}
        </p>
        <div className="actions">
          {/* Favorite Button */}
          <Button variant="light" onClick={toggleFavorite}>
            {isFavorite ? <HeartFill color="red" /> : <Heart />}
          </Button>

          {/* Add to Cart Button */}
          <Button variant="primary" onClick={() => console.log('Add to Cart')}>
            <CartIcon />
            {' '}
            Add to Cart
          </Button>

          {/* Make an Offer Button */}
          <Button variant="success" onClick={handleModalOpen}>
            <CurrencyDollar />
            {' '}
            Make an Offer
          </Button>
        </div>
      </div>

      {/* Make an Offer Modal */}
      <Modal show={showOfferModal} onHide={handleModalClose} centered size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="d-flex align-items-center">
            <CurrencyDollar size={24} className="me-2 text-success" />
            Make an Offer
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="text-center mb-4 p-3 bg-white rounded-lg shadow-sm">
            <h3 id="total-display" className="mb-0">
              Total Offer:
              {' '}
              <strong className="text-success">
                $
                {(coinTotal / 100).toFixed(2)}
              </strong>
            </h3>
          </div>

          <div className="mb-4">
            <h6 className="text-muted mb-2">Quick Amounts:</h6>
            <div className="d-flex justify-content-between gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={`quick-${amount}`}
                  variant="outline-primary"
                  className="flex-grow-1"
                  onClick={() => handleQuickAmount(amount)}
                >
                  $
                  {(amount / 100).toFixed(2)}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h6 className="text-muted mb-2">Add Coins:</h6>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {coinValues.map((value) => {
                const style = getCoinStyle(value);
                return (
                  <Button
                    key={`coin-${value}`}
                    variant="outline-primary"
                    onClick={() => handleCoinClick(value)}
                    className="coin-button d-flex flex-column align-items-center justify-content-center p-2"
                    style={{
                      width: 80,
                      height: 80,
                      background: style.bg,
                      color: style.color,
                      border: 'none',
                      borderRadius: '50%',
                      transition: 'transform 0.2s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <div className="font-weight-bold mb-1">
                      $
                      {(value / 100).toFixed(2)}
                    </div>
                    <div className="small text-center">
                      {value >= 100 ? 'Bill' : 'Coin'}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mb-3">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setCoinTotal((prev) => Math.max(0, prev - 1))}
            >
              <Dash />
              1¢
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setCoinTotal((prev) => prev + 1)}
            >
              <Plus />
              1¢
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleReset}>
              <ArrowCounterclockwise />
              Reset
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSubmitOffer}
          >
            Submit Offer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export async function getServerSideProps() {
  const products = [
    { id: 1, name: 'Product A', price: 100, ownerId: 2 },
    { id: 2, name: 'Product B', price: 150, ownerId: 3 },
  ]; // Replace with actual database query

  return { props: { products } };
}
