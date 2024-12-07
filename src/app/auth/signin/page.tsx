/* eslint-disable import/no-extraneous-dependencies */

'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SignIn = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  }, [session, router]);

  // Show loading state while checking session
  if (status === 'loading') {
    return null;
  }

  // Don't render the form if authenticated
  if (session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/home',
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <div className="mb-4">
              <div className="text-center mb-3">
                <h1 className="display-6 fw-bold">Welcome back</h1>
                <p className="text-muted">Enter your credentials to sign in</p>
              </div>

              <Card className="p-4">
                <form onSubmit={handleSubmit} className="mb-3">
                  {error && (
                    <Alert variant="destructive" className="mb-3">
                      <AlertCircle className="me-2" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="mb-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="form-control"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <div className="position-relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="form-control pe-5"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
                      >
                        {showPassword ? (
                          <EyeOff className="h4" />
                        ) : (
                          <Eye className="h4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-100" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="me-2 spinner-border spinner-border-sm" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </form>

                <div className="text-center text-muted small">
                  Don&apos;t have an account?
                  {' '}
                  <a
                    href="/auth/signup"
                    className="text-primary text-decoration-none"
                  >
                    Sign up
                  </a>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignIn;
