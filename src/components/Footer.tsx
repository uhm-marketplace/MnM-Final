/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-unknown-property */

'use client';

import { Container } from 'react-bootstrap';
import { MapPin, Globe, School } from 'lucide-react';

const Footer = () => (
  <footer className="mt-auto py-4 bg-white border-top">
    <Container>
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <div className="col-md-4 d-flex align-items-center">
          <span className="text-muted small me-2">
            ©
            {new Date().getFullYear()}
            {' '}
            |
            Mānoa Now Marketplace.
          </span>
          <span className="text-muted small">All rights reserved.</span>
        </div>
        <ul className="nav col-md-4 justify-content-end list-unstyled d-flex align-items-center mb-0">
          <li className="ms-3 d-flex align-items-center">
            <School size={18} className="me-2" />
            <span className="text-muted small">University of Hawaii</span>
          </li>
          <li className="ms-3 d-flex align-items-center">
            <MapPin size={18} className="me-2" />
            <span className="text-muted small">Honolulu, HI 96822</span>
          </li>
          <li className="ms-3 d-flex align-items-center">
            <Globe size={18} className="me-2" />
            <a
              href="https://uhm-marketplace.github.io"
              className="text-muted small text-decoration-none transition-all hover-lift"
            >
              uhm-marketplace.github.io
            </a>
          </li>
        </ul>
      </div>
    </Container>

    <style jsx>
      {`
        .hover-lift {
          transition: all 0.2s ease-in-out;
        }
        .hover-lift:hover {
          transform: translateY(-1px);
          text-decoration: underline !important;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
      `}
    </style>
  </footer>
);

export default Footer;
