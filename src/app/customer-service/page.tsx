/* eslint-disable react/no-unknown-property */

'use client';

import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { Envelope, People } from 'react-bootstrap-icons';

interface StaffMember {
  name: string;
  role: string;
  email: string;
}

const staffMembers: StaffMember[] = [
  {
    name: 'Joanne Oshiro',
    role: 'Leader & Front-End',
    email: 'joanne21@hawaii.edu',
  },
  {
    name: 'Josef Leander Del Rosario',
    role: 'Back-End',
    email: 'josef4@hawaii.edu',
  },
  {
    name: 'Lionel Derrick Roxas',
    role: 'Back-End',
    email: 'ldroxas@hawaii.edu',
  },
  { name: 'Naomi Toloumu', role: 'Front-End', email: 'ntoloumu@gmail.com' },
  { name: 'Alex Cornwell', role: 'Back-End', email: 'ac336@hawaii.edu' },
];

const CSPage: React.FC = () => (
  <Container className="py-5">
    <div className="text-center mb-5">
      <h1 className="display-4 mb-4">Contact Us</h1>
      <div className="mx-auto" style={{ maxWidth: '700px' }}>
        <Card className="shadow-sm border-0 bg-light p-4 mb-5">
          <Card.Body>
            <People size={40} className="text-primary mb-3" />
            <h3 className="h4 mb-3">Need Help or Encountered an Issue?</h3>
            <p className="text-muted mb-0">
              If you experience any errors or need assistance navigating the
              site, do not hesitate to contact our team. We are here to help and
              ensure you have the best experience possible. Simply reach out to
              one of our staff members below!
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>

    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {staffMembers.map((staff) => (
        <div key={staff.email} className="col">
          <Card className="h-100 border-0 shadow-sm hover-card">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex p-3">
                  <Envelope size={24} className="text-primary" />
                </div>
              </div>
              <h4 className="h5 mb-2">{staff.name}</h4>
              <p className="text-muted small mb-3">{staff.role}</p>
              <a
                href={`mailto:${staff.email}`}
                className="text-primary text-decoration-none fw-medium"
                style={{ fontSize: '0.9rem' }}
              >
                {staff.email}
              </a>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>

    <style jsx global>
      {`
      .hover-card {
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }
      .hover-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
      }
      .bg-opacity-10 {
        --bs-bg-opacity: 0.1;
      }
    `}
    </style>
  </Container>
);

export default CSPage;
