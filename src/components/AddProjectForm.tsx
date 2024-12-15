/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Multiselect from 'multiselect-react-dropdown';
import { Interest, User } from '@prisma/client';
import { AddProjectSchema, IProject } from '@/lib/validationSchemas';
import { upsertProject } from '@/lib/dbActions';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Image,
  Link,
  DollarSign,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import swal from 'sweetalert';

const AddProjectForm = ({
  interests,
  participants,
  userEmail,
}: {
  interests: Interest[];
  participants: User[];
  userEmail: string;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const interestNames = interests.map((interest) => interest.name);
  const participantNames = participants.map((participant) => participant.email);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddProjectSchema),
    defaultValues: {
      participants: [userEmail],
    },
  });

  const onSubmit = async (data: IProject) => {
    setIsLoading(true);
    try {
      const result = await upsertProject(data);
      if (result) {
        swal('Success!', 'Project data saved successfully!', 'success');
        reset({
          participants: [userEmail],
        });
      } else {
        swal('Error!', 'Failed to save project data!', 'error');
      }
    } catch (err) {
      swal('Error!', 'Failed to save project data!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-vh-100 bg-light py-5">
        <Container>
          <Card className="p-4">
            <div className="text-center">Loading...</div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold" style={{ color: '#376551' }}>
            Add New Product
          </h1>
          <p className="text-muted">Create a new product listing</p>
        </div>

        <Card className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="me-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mb-4">
              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Label htmlFor="name">
                    Product Name
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    {...register('name')}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <div className="invalid-feedback d-block">
                      {errors.name.message}
                    </div>
                  )}
                </Col>

                <Col xs={12} md={6} className="mb-3">
                  <Label htmlFor="price">
                    Price ($)
                    <span className="text-danger">*</span>
                  </Label>
                  <div className="position-relative">
                    <DollarSign
                      className="position-absolute top-50 translate-middle-y ms-2 text-muted"
                      size={18}
                    />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('price')}
                      className={`form-control ps-4 ${errors.price ? 'is-invalid' : ''}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <div className="invalid-feedback d-block">
                      {errors.price.message}
                    </div>
                  )}
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Label htmlFor="picture">
                    Picture URL
                    <span className="text-danger">*</span>
                  </Label>
                  <div className="position-relative">
                    <Image
                      className="position-absolute top-50 translate-middle-y ms-2 text-muted"
                      size={18}
                    />
                    <Input
                      id="picture"
                      type="text"
                      {...register('picture')}
                      className={`form-control ps-4 ${errors.picture ? 'is-invalid' : ''}`}
                      placeholder=" Enter image URL"
                    />
                  </div>
                  {errors.picture && (
                    <div className="invalid-feedback d-block">
                      {errors.picture.message}
                    </div>
                  )}
                </Col>

                <Col xs={12} md={6} className="mb-3">
                  <Label htmlFor="homepage">Homepage URL</Label>
                  <div className="position-relative">
                    <Link
                      className="position-absolute top-50 translate-middle-y ms-2 text-muted"
                      size={18}
                    />
                    <Input
                      id="homepage"
                      type="text"
                      {...register('homepage')}
                      className={`form-control ps-4 ${errors.homepage ? 'is-invalid' : ''}`}
                      placeholder=" Enter website URL"
                    />
                  </div>
                  {errors.homepage && (
                    <div className="invalid-feedback d-block">
                      {errors.homepage.message}
                    </div>
                  )}
                </Col>
              </Row>

              <div className="mb-3">
                <Label htmlFor="description">
                  Description
                  <span className="text-danger">*</span>
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  placeholder="Describe your product here..."
                  rows={4}
                />
                {errors.description && (
                  <div className="invalid-feedback d-block">
                    {errors.description.message}
                  </div>
                )}
              </div>

              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Label htmlFor="interests">
                    Product Interest
                    <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="interests"
                    render={({ field: { value, onChange } }) => (
                      <Multiselect
                        options={interestNames}
                        isObject={false}
                        showCheckbox
                        hidePlaceholder
                        closeOnSelect={false}
                        onSelect={onChange}
                        onRemove={onChange}
                        selectedValues={value}
                        placeholder="Select categories"
                        style={{
                          chips: { color: '#fff', background: '#007bff' },
                          searchBox: {
                            border: '1px solid #ced4da',
                            borderRadius: '0.375rem',
                            padding: '0.5rem',
                            color: '#fff',
                          },
                        }}
                      />
                    )}
                  />
                </Col>

                <Col xs={12} md={6} className="mb-3">
                  <Label htmlFor="participants">Seller Email</Label>
                  <Controller
                    control={control}
                    name="participants"
                    render={({ field: { value } }) => (
                      <Multiselect
                        options={participantNames}
                        isObject={false}
                        showCheckbox
                        hidePlaceholder
                        closeOnSelect={false}
                        onSelect={() => {}}
                        onRemove={() => {}}
                        selectedValues={[userEmail]}
                        disable
                        style={{
                          chips: { color: '#fff', background: '#6c757d' },
                          searchBox: {
                            border: '1px solid #ced4da',
                            borderRadius: '0.375rem',
                            padding: '0.5rem',
                            color: '#fff',
                          },
                        }}
                      />
                    )}
                  />
                </Col>
              </Row>

              <div className="d-grid gap-2">
                <Button type="submit" className="w-100" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="me-2 spinner-border spinner-border-sm" />
                      Saving...
                    </>
                  ) : (
                    'Create Product'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset({ participants: [userEmail] })}
                  className="w-100"
                >
                  <RefreshCw className="me-2" />
                  Reset Form
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </Container>
    </div>
  );
};

export default AddProjectForm;
