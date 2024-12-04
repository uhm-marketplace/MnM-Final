/* eslint-disable react/no-unknown-property */

'use client';

import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { PageIDs } from '@/utilities/ids';
import {
  ArrowDownCircle,
  Cart,
  StarFill,
  PersonCircle,
} from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';

export default function Home() {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Welcome to Mānoa Now Marketplace';
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentIndex = 0;

    // Type out text
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // Adjust speed here

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <main>
      <div id={PageIDs.landingPage}>
        {/* Hero Section */}
        <section className="hero-section text-center position-relative">
          <Container className="py-5">
            <h1 className="display-3 fw-bold mb-3 text-white typing-container">
              {displayText}
              <span className={`cursor ${showCursor ? 'visible' : 'hidden'}`}>
                |
              </span>
            </h1>
            <p className="lead text-white-50 mb-4">
              An online marketplace for the UH community to buy and sell goods
            </p>
            <Button
              variant="light"
              size="lg"
              href="#get-started"
              className="rounded-pill px-4"
            >
              Get Started
              <ArrowDownCircle size={20} className="ms-2" />
            </Button>
          </Container>
        </section>

        {/* Get Started Section */}
        <section id="get-started" className="py-5">
          <Container>
            <h2 className="text-center mb-5 text-primary">
              <PersonCircle size={40} className="mb-3 d-block mx-auto" />
              Start Your Journey
            </h2>
            <Row className="g-4 align-items-center">
              <Col md={6}>
                <div className="image-card">
                  <Image
                    src="/images/signup.png"
                    fluid
                    className="rounded shadow-sm"
                    alt="sign up"
                  />
                  <p className="mt-3 text-muted text-center">
                    Quick and easy sign-up process
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="image-card">
                  <Image
                    src="/images/createprofile.png"
                    fluid
                    className="rounded shadow-sm"
                    alt="profile"
                  />
                  <p className="mt-3 text-muted text-center">
                    Create your personalized profile
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Shop Section */}
        <section className="bg-primary bg-opacity-10 py-5">
          <Container>
            <h2 className="text-center mb-5 text-primary">
              <Cart size={40} className="mb-3 d-block mx-auto" />
              Shop and Sell
            </h2>
            <Row className="g-4 align-items-center">
              <Col md={6}>
                <div className="image-card">
                  <Image
                    src="/images/add-project-page.png"
                    fluid
                    className="rounded shadow-sm"
                    alt="add-project-page"
                  />
                  <p className="mt-3 text-muted text-center">
                    List your items easily
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="image-card">
                  <Image
                    src="/images/projects-page.png"
                    fluid
                    className="rounded shadow-sm"
                    alt="projects-page"
                  />
                  <p className="mt-3 text-muted text-center">
                    Browse available products
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Reviews Section */}
        <section className="py-5">
          <Container>
            <h2 className="text-center mb-5 text-primary">
              <StarFill size={40} className="mb-3 d-block mx-auto" />
              Community Reviews
            </h2>
            <Row className="g-4 align-items-center">
              <Col md={6}>
                <div className="image-card">
                  <Image
                    src="/images/interests-page.png"
                    fluid
                    className="rounded shadow-sm"
                    alt="interest-page"
                  />
                  <p className="mt-3 text-muted text-center">
                    Share your interests
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="image-card">
                  <Image
                    src="/images/filter-page.png"
                    fluid
                    className="rounded shadow-sm"
                    alt="filter-page"
                  />
                  <p className="mt-3 text-muted text-center">
                    Filter and find what you need
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      <style jsx global>
        {`
          .hero-section {
          background: linear-gradient(135deg, #376551 0%, #2c4f3f 100%);
          padding: 100px 0;
          margin-bottom: 40px;
        }

        .typing-container {
          min-height: 80px; /* Prevents layout shift */
          display: inline-block;
        }

        .cursor {
          display: inline-block;
          margin-left: 2px;
          opacity: 1;
          animation: blink 1s infinite;
        }

        .cursor.visible {
          opacity: 1;
        }

        .cursor.hidden {
          opacity: 0;
        }

        .image-card {
          transition: transform 0.3s ease;
        }

        .image-card:hover {
          transform: translateY(-10px);
        }

        .image-card img {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }

        .image-card:hover img {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        section {
          overflow: hidden;
        }

        .text-primary {
          color: #376551 !important;
        }

        .bg-primary {
          background-color: #376551 !important;
        }

        .btn-light:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        `}
      </style>
    </main>
  );
}
