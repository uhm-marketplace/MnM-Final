/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */

'use client';

import { useState, useEffect } from 'react';
import { Button, Alert, Modal, Form } from 'react-bootstrap';
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
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const { data: session } = useSession();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [coinTotal, setCoinTotal] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<number | null>(null);
  const currentUser = session?.user?.email;

  const [isInterested, setIsInterested] = useState(
    projectData.buyers.some((buyer) => buyer.email === currentUser),
  );

  const handleFetchProfile = async () => {
    if (!currentUser) {
      console.error('Error: No current user available to fetch profile.');
      return null;
    }

    try {
      const profileResponse = await fetch(`/api/profile?email=${currentUser}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (!profileData?.id) {
          console.error('Error: Profile ID is missing from API response.');
          return null;
        }
        return profileData;
      }
      const errorData = await profileResponse.json();
      console.error('Error fetching profile:', errorData.error || 'Unknown error');
      return null;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  };

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

  useEffect(() => {
    const fetchInterestStatus = async () => {
      const profileData = await handleFetchProfile();
      if (!profileData) return;

      const fetchedInterestStatus = projectData.buyers.some(
        (buyer) => buyer.id === profileData.id,
      );
      console.log('Fetched interest status:', fetchedInterestStatus);
      setIsInterested(fetchedInterestStatus);
    };

    fetchInterestStatus();
  }, [projectData, currentUser]);

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

      console.log('Project Data:', projectData);
      console.log('User Session:', session);

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

  const quickAmounts = [100, 500, 1000, 5000, 10000];
  const coinValues = [1, 5, 10, 25, 100, 500, 1000];

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
    const profileData = await handleFetchProfile();
    if (!profileData) {
      alert('Failed to fetch profile. Please try again.');
      return;
    }

    const payload = {
      projectId: projectData.id,
      profileId: profileData.id,
    };
    console.log('Submitting interest toggle:', payload);

    try {
      const response = await fetch('/api/projects/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Interest toggle result:', result);
        setIsInterested(result.interested); // Update UI state based on response
      } else {
        const errorData = await response.json();
        console.error('Error toggling interest:', errorData.error);
        alert('Failed to toggle interest. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="project-card-with-cart position-relative h-100 ">
      <ProjectCard project={projectData} />

      <div className="position-absolute bottom-0 end-0 mb-3 me-3 d-flex gap-2">
        {currentUser && (
          <>
            {isInterested && (
              <Button
                variant="success"
                onClick={() => setShowOfferModal(true)}
                className="d-flex align-items-center"
                size="sm"
              >
                <CurrencyDollar size={14} fill="gold" />
              </Button>
            )}
            <Button
              variant={isInterested ? 'danger' : 'outline-danger'}
              onClick={() => console.log('Toggle interest')} // Replace with actual handler
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

      <Modal show={showOfferModal} onHide={() => setShowOfferModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit Your Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Bid Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter your bid"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                disabled={isLoading}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOfferModal(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSubmitOffer}
            disabled={isLoading || !bidAmount}
          >
            {isLoading ? 'Submitting...' : 'Submit Offer'}
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
