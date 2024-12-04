/* eslint-disable react/no-unknown-property */

'use client';

import { Col, Container } from 'react-bootstrap';

const Footer = () => (
  <footer className="footer mt-auto py-3 bg-light border-top">
    <Container>
      <Col className="text-center">
        <div className="mb-2" style={{ fontWeight: 600 }}>
          Mānoa Now Marketplace Project
        </div>
        <div className="text-muted">
          University of Hawaii
          <br />
          Honolulu, HI 96822
          <br />
          <a
            href="https://uhm-marketplace.github.io"
            className="text-primary text-decoration-none hover-underline"
          >
            https://uhm-marketplace.github.io
          </a>
        </div>
      </Col>
    </Container>

    <style jsx>
      {`
      .hover-underline:hover {
        text-decoration: underline !important;
      }
    `}
    </style>
  </footer>
);

export default Footer;
