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

const ProjectCardWithCart = ({
  projectData,
}: {
  projectData: ProjectCardData;
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

  const currentUser = session?.user?.email;

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
    return <div>Error: Product data is missing.</div>;
  }

  const { name, price, id } = projectData;

  if (!name || !price || !id) {
    return <div>Error: Product details are incomplete.</div>;
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
    try {
      const response = await fetch('/api/bidding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidAmount: coinTotal / 100, // Convert cents to dollars
          userId: 1, // Placeholder for userId
          productId: id, // Pass the productId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit bid');
      }

      const data = await response.json();
      console.log('Bid submitted successfully:', data);
      handleModalClose();
    } catch (error) {
      console.error('Error submitting bid:', error);
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
            onClick={() => {
              console.log(`Offer: $${(coinTotal / 100).toFixed(2)}`);
              handleModalClose();
            }}
          >
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

export default ProjectCardWithCart;