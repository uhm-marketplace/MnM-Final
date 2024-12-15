/* eslint-disable import/no-extraneous-dependencies */

'use client';

import { signOut } from 'next-auth/react';
import { Container, Row, Col } from 'react-bootstrap';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, X } from 'lucide-react';

const SignOut = () => (
  <div className="min-vh-100 bg-light py-5">
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <div className="text-center mb-4">
            <h1 className="display-6 fw-bold">Sign Out</h1>
            <p className="text-muted">Are you sure you want to sign out?</p>
          </div>

          <Card className="p-4">
            <div className="d-grid gap-3">
              <Button
                variant="destructive"
                className="w-100 py-2"
                onClick={() => signOut({ callbackUrl: '/', redirect: true })}
              >
                <LogOut className="me-2" />
                Sign Out
              </Button>

              <Button
                variant="outline"
                className="w-100 py-2"
                onClick={() => (window.location.href = '/')}
              >
                <X className="me-2" />
                Cancel
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

export default SignOut;
