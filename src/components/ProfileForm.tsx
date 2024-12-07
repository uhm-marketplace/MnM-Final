/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-nested-ternary */

'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import Multiselect from 'multiselect-react-dropdown';
import { IProfile, ProfileSchema } from '@/lib/validationSchemas';
import { Interest, Profile, Project } from '@prisma/client';
import { createProfile, updateProfile } from '@/lib/dbActions';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  RefreshCw,
  User,
  Mail,
  Image as ImageIcon,
} from 'lucide-react';

const ProfileForm = ({
  profile,
  interests,
  projects,
  profileInterests,
  profileProjects,
  isNewProfile,
}: {
  profile: Profile;
  interests: Interest[];
  projects: Project[];
  profileInterests: Interest[];
  profileProjects: Project[];
  isNewProfile: boolean;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pictureUrl, setPictureUrl] = useState('');
  const [interestNames, setInterestNames] = useState<string[]>([]);
  const [profileInterestNames, setProfileInterestNames] = useState<string[]>(
    [],
  );
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [profileProjectNames, setProfileProjectNames] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    setPictureUrl(profile.picture || '');
    setInterestNames(interests.map((interest) => interest.name));
    setProfileInterestNames(profileInterests.map((interest) => interest.name));
    setProjectNames(projects.map((project) => project.name));
    setProfileProjectNames(profileProjects.map((project) => project.name));
  }, [profile, interests, projects, profileInterests, profileProjects]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      bio: profile.bio || '',
      picture: profile.picture || '',
      interests: profileInterestNames,
      projects: profileProjectNames,
    },
  });

  const onSubmit = async (data: IProfile) => {
    setIsLoading(true);
    try {
      const result = isNewProfile
        ? await createProfile(data)
        : await updateProfile(data);

      if (result) {
        await swal(
          'Success!',
          `Profile ${isNewProfile ? 'created' : 'updated'} successfully!`,
          'success',
        );
      } else {
        await swal(
          'Error!',
          `Failed to ${isNewProfile ? 'create' : 'update'} profile!`,
          'error',
        );
      }
    } catch (error) {
      console.error('Error with profile:', error);
      await swal(
        'Error!',
        `Failed to ${isNewProfile ? 'create' : 'update'} profile!`,
        'error',
      );
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
            {isNewProfile ? 'Create Profile' : 'Update Profile'}
          </h1>
          <p className="text-muted">
            {isNewProfile
              ? 'Set up your profile information'
              : 'Manage your profile information'}
          </p>
        </div>

        <Card className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Label htmlFor="firstName">
                    First Name
                    <span className="text-danger">*</span>
                  </Label>
                  <div className="position-relative">
                    <User
                      className="position-absolute top-50 translate-middle-y ms-2 text-muted"
                      size={18}
                    />
                    <Input
                      id="firstName"
                      type="text"
                      {...register('firstName')}
                      className={`form-control ps-4 ${errors.firstName ? 'is-invalid' : ''}`}
                      placeholder=" Enter your first name"
                    />
                  </div>
                  {errors.firstName?.message && (
                    <div className="invalid-feedback d-block">
                      {errors.firstName.message}
                    </div>
                  )}
                </Col>

                <Col xs={12} md={6} className="mb-3">
                  <Label htmlFor="lastName">
                    Last Name
                    <span className="text-danger">*</span>
                  </Label>
                  <div className="position-relative">
                    <User
                      className="position-absolute top-50 translate-middle-y ms-2 text-muted"
                      size={18}
                    />
                    <Input
                      id="lastName"
                      type="text"
                      {...register('lastName')}
                      className={`form-control ps-4 ${errors.lastName ? 'is-invalid' : ''}`}
                      placeholder=" Enter your last name"
                    />
                  </div>
                  {errors.lastName?.message && (
                    <div className="invalid-feedback d-block">
                      {errors.lastName.message}
                    </div>
                  )}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Label htmlFor="email">
                    Email
                    <span className="text-danger">*</span>
                  </Label>
                  <div className="position-relative">
                    <Mail
                      className="position-absolute top-50 translate-middle-y ms-2 text-muted"
                      size={18}
                    />
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="form-control ps-4"
                      readOnly
                    />
                  </div>
                </Col>
              </Row>

              <div className="mb-3">
                <Label htmlFor="bio">
                  Biographical Statement
                  <span className="text-danger">*</span>
                </Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
                {errors.bio?.message && (
                  <div className="invalid-feedback d-block">
                    {errors.bio.message}
                  </div>
                )}
              </div>

              <Row>
                <Col xs={12} md={6} className="mb-3">
                  <Label htmlFor="interests">Interests</Label>
                  <Controller
                    control={control}
                    name="interests"
                    render={({ field: { onChange } }) => (
                      <Multiselect
                        options={interestNames}
                        isObject={false}
                        showCheckbox
                        hidePlaceholder
                        closeOnSelect={false}
                        onSelect={onChange}
                        onRemove={onChange}
                        selectedValues={profileInterestNames}
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
                  <Label htmlFor="projects">Product Listings</Label>
                  <Controller
                    control={control}
                    name="projects"
                    render={({ field: { onChange } }) => (
                      <Multiselect
                        options={projectNames}
                        isObject={false}
                        showCheckbox
                        hidePlaceholder
                        closeOnSelect={false}
                        onSelect={onChange}
                        onRemove={onChange}
                        selectedValues={profileProjectNames}
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

              <div className="mb-4">
                <Label htmlFor="picture">Profile Picture URL</Label>
                <div className="position-relative">
                  <ImageIcon
                    className="position-absolute top-50 translate-middle-y ms-2 text-muted"
                    size={18}
                  />
                  <Input
                    id="picture"
                    type="text"
                    {...register('picture')}
                    className={`form-control ps-4 ${errors.picture ? 'is-invalid' : ''}`}
                    placeholder=" Enter image URL"
                    onChange={(e) => setPictureUrl(e.target.value)}
                  />
                </div>
                {errors.picture?.message && (
                  <div className="invalid-feedback d-block">
                    {errors.picture.message}
                  </div>
                )}
                {pictureUrl && (
                  <div className="mt-3">
                    <p className="text-muted mb-2">Preview:</p>
                    <img
                      src={pictureUrl}
                      alt="Profile preview"
                      className="rounded"
                      style={{ maxWidth: '200px' }}
                    />
                  </div>
                )}
              </div>

              <div className="d-grid gap-2">
                <Button type="submit" className="w-100" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="me-2 spinner-border spinner-border-sm" />
                      {isNewProfile
                        ? 'Creating Profile...'
                        : 'Updating Profile...'}
                    </>
                  ) : isNewProfile ? (
                    'Create Profile'
                  ) : (
                    'Update Profile'
                  )}
                </Button>

                {!isNewProfile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                    className="w-100"
                  >
                    <RefreshCw className="me-2" />
                    Reset Form
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Card>
      </Container>
    </div>
  );
};

export default ProfileForm;
