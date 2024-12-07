/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-alert */

'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createUser } from '@/lib/dbActions';

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid')
      .test(
        'is-hawaii-email',
        'Only hawaii.edu emails are allowed',
        (value) => value?.endsWith('@hawaii.edu') || false,
      ),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    setError('');

    try {
      if (!data.email.endsWith('@hawaii.edu')) {
        setError('Only hawaii.edu email addresses are allowed.');
        return;
      }

      await createUser(data);
      await signIn('credentials', {
        callbackUrl: '/home',
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError('An error occurred during sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold">Create Account</h1>
              <p className="text-muted">Sign up with your UH account</p>
            </div>

            <Card className="p-4">
              <form onSubmit={handleSubmit(onSubmit)} className="mb-3">
                {error && (
                  <Alert variant="destructive" className="mb-3">
                    <AlertCircle className="me-2" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="mb-3">
                  <Label htmlFor="email">UH Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="your.name@hawaii.edu"
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <Label htmlFor="password">Password</Label>
                  <div className="position-relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className={`form-control pe-5 ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Create a password"
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
                  {errors.password && (
                    <div className="invalid-feedback d-block">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="position-relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      className={`form-control pe-5 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h4" />
                      ) : (
                        <Eye className="h4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback d-block">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>

                <div className="d-grid gap-2">
                  <Button type="submit" className="w-100" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="me-2 spinner-border spinner-border-sm" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                    className="w-100"
                  >
                    <RefreshCw className="me-2" />
                    Reset Form
                  </Button>
                </div>
              </form>

              <div className="text-center text-muted">
                Already have an account?
                {' '}
                <a
                  href="/auth/signin"
                  className="text-primary text-decoration-none"
                >
                  Sign in
                </a>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;
