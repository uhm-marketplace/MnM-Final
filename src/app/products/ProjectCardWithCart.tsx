/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */

'use client';

import { useState, useEffect } from 'react';
import { Button, Alert, Modal } from 'react-bootstrap';
import {
  Cart as CartIcon,
  Heart,
  HeartFill,
  CurrencyDollar,
  Plus,
  Dash,
  ArrowCounterclockwise,
} from 'react-bootstrap-icons';
import ProjectCard from '@/components/ProjectCard';
import { ProjectCardData } from '@/lib/ProjectCardData';
import { useSession } from 'next-auth/react';
import PropTypes from 'prop-types';

const ProjectCardWithCart = ({
  projectData,
  userId,
}) => {
  const [isInCart, setIsInCart] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const { data: session } = useSession();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [coinTotal, setCoinTotal] = useState(0);
  const coinValues = [1, 5, 10, 25, 100, 500, 1000]; // $0.01 through $10.00
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [quickAmounts, setQuickAmounts] = useState([500, 1000, 2500, 5000]); // $5, $10, $25, $50

  const currentUser = session?.user?.id;

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setIsInCart(
      cart.some((item: ProjectCardData) => item.name === projectData.name),
    );

    if (currentUser) {
      setIsInterested(
        projectData.buyers.some((buyer) => buyer.email === currentUser),
      );
    }
  }, [projectData.name, projectData.buyers, currentUser]);

  if (!projectData) {
    return <div>Error: Project data is missing.</div>;
  }

  const { name, price, id } = projectData;

  if (!name || !price || !id) {
    return <div>Error: Project details are incomplete.</div>;
  }

  const getCoinStyle = (value: number) => {
    switch (value) {
      case 1:
        return {
          bg: 'linear-gradient(145deg, #B87333, #cb8e53)',
          color: 'white',
        }; // Copper
      case 5:
        return {
          bg: 'linear-gradient(145deg, #C0C0C0, #d6d6d6)',
          color: 'black',
        }; // Silver
      case 10:
        return {
          bg: 'linear-gradient(145deg, #C0C0C0, #e6e6e6)',
          color: 'black',
        }; // Silver
      case 25:
        return {
          bg: 'linear-gradient(145deg, #FFD700, #ffe44d)',
          color: 'black',
        }; // Gold
      case 100:
        return {
          bg: 'linear-gradient(145deg, #90EE90, #b4f5b4)',
          color: 'black',
        }; // Light green
      case 500:
        return {
          bg: 'linear-gradient(145deg, #87CEEB, #b0e0f5)',
          color: 'black',
        }; // Sky blue
      case 1000:
        return {
          bg: 'linear-gradient(145deg, #DDA0DD, #ecc6ec)',
          color: 'black',
        }; // Plum
      default:
        return {
          bg: 'linear-gradient(145deg, #f8f9fa, #e9ecef)',
          color: 'black',
        };
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (isInCart) {
      const newCart = cart.filter(
        (item: ProjectCardData) => item.name !== projectData.name,
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      setIsInCart(false);
    } else {
      cart.push(projectData);
      localStorage.setItem('cart', JSON.stringify(cart));
      setIsInCart(true);
    }

    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleInterestClick = async () => {
    if (!currentUser) return;

    try {
      const profileResponse = await fetch(`/api/profile?email=${currentUser}`);
      const profileData = await profileResponse.json();

      if (!profileData?.id) {
        setShowProfileAlert(true);
        return;
      }

      const response = await fetch('/api/projects/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectData.id,
          profileId: profileData.id,
        }),
      });

      if (response.ok) {
        setIsInterested(!isInterested);
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
      }
    } catch (error) {
      console.error('Error updating interest:', error);
    }
  };

  const handleMakeOfferClick = () => {
    setShowOfferModal(true);
  };

  const handleModalClose = () => {
    setShowOfferModal(false);
    setCoinTotal(0);
  };

  const handleCoinClick = (value: number) => {
    setCoinTotal((prev) => prev + value);
    const totalElement = document.getElementById('total-display');
    totalElement?.classList.add('scale-up-center');
    setTimeout(() => totalElement?.classList.remove('scale-up-center'), 200);
  };

  const handleQuickAmount = (amount: number) => {
    setCoinTotal(amount);
  };

  const handleReset = () => {
    setCoinTotal(0);
    setSelectedCoin(null);
  };

  const handleSubmitOffer = async () => {
    if (!currentUser) {
      alert('You must be logged in to submit an offer.');
      return;
    }

    console.log('Submitting offer with:', {
      coinTotal,
      userId: currentUser,
      projectId: projectData.id,
    });

    try {
      const response = await fetch('/api/bidding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidAmount: coinTotal / 100,
          userId: currentUser,
          productId: projectData.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error details:', errorData);
        alert(errorData.error || 'Failed to submit offer.');
        return;
      }

      const data = await response.json();
      console.log('Bid submitted successfully:', data);
      alert('Offer submitted successfully!');
      handleModalClose();
    } catch (error) {
      console.error('Error in handleSubmitOffer:', error);
      alert('Failed to submit offer.');
    }
  };

  return (
    <div className="position-relative h-100">
      <ProjectCard project={projectData} />

      <div className="position-absolute bottom-0 end-0 mb-3 me-3 d-flex gap-2">
        {currentUser && (
          <>
            {isInterested && (
              <Button
                variant="success"
                onClick={handleMakeOfferClick}
                className="d-flex align-items-center"
                size="sm"
              >
                <CurrencyDollar size={14} fill="gold" />
              </Button>
            )}
            <Button
              variant={isInterested ? 'danger' : 'outline-danger'}
              onClick={handleInterestClick}
              className="d-flex align-items-center gap-1"
              size="sm"
            >
              {isInterested ? <HeartFill size={14} /> : <Heart size={14} />}
            </Button>
          </>
        )}

        <Button
          variant={isInCart ? 'outline-danger' : 'outline-success'}
          onClick={handleAddToCart}
          className="d-flex align-items-center gap-1"
          size="sm"
        >
          <CartIcon size={14} />
          {isInCart ? '-' : '+'}
        </Button>
      </div>

      {showProfileAlert && (
        <Alert
          variant="warning"
          onClose={() => setShowProfileAlert(false)}
          dismissible
        >
          Please create your profile first to access this feature.
        </Alert>
      )}

      <Modal show={showOfferModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Make an Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Quick Offer Amounts:</p>
          {quickAmounts.map((amount, index) => (
            <Button
              key={`quick-${amount}`}
              onClick={() => handleQuickAmount(amount)}
            >
              $
              {amount / 100}
            </Button>
          ))}
          <div>
            <p>
              Current Offer: $
              {coinTotal / 100}
            </p>
            {coinValues.map((value, index) => (
              <Button
                key={`coin-${value}`}
                onClick={() => handleCoinClick(value)}
              >
                +
                {value}
                ¢
              </Button>
            ))}
          </div>
          <Button variant="danger" onClick={handleReset}>
            <ArrowCounterclockwise />
            {' '}
            Reset
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleSubmitOffer}>
            Submit Offer
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>
        {`
          .scale-up-center {
            animation: scale-up-center 0.2s cubic-bezier(0.39, 0.575, 0.565, 1)
              both;
          }

          @keyframes scale-up-center {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          .coin-button:active {
            transform: scale(0.95) !important;
          }
        `}
      </style>
    </div>
  );
};

ProjectCardWithCart.propTypes = {
  projectData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    buyers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
  userId: PropTypes.string,
};

ProjectCardWithCart.defaultProps = {
  userId: '',
};

export default ProjectCardWithCart;
