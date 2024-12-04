/* eslint-disable @next/next/no-img-element */

'use client';

import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Container, Card, Row } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import Multiselect from 'multiselect-react-dropdown';
import { IProfile, ProfileSchema } from '@/lib/validationSchemas';
import { Interest, Profile, Project } from '@prisma/client';
import { createProfile, updateProfile } from '@/lib/dbActions';

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
  const formPadding = 'py-1';
  const [isClient, setIsClient] = useState(false);
  const [pictureUrl, setPictureUrl] = useState('');
  const [interestNames, setInterestNames] = useState<string[]>([]);
  const [profileInterestNames, setProfileInterestNames] = useState<string[]>([]);
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
    }
  };

  if (!isClient) {
    return (
      <Container>
        <Card>
          <Card.Body>
            <div>Loading...</div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className={formPadding}>
              <Col xs={4}>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name*</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('firstName')}
                  />
                  {errors.firstName?.message && (
                    <Form.Text className="text-danger">
                      {errors.firstName.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('lastName')}
                  />
                  {errors.lastName?.message && (
                    <Form.Text className="text-danger">
                      {errors.lastName.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('email')}
                    readOnly
                  />
                  {errors.email?.message && (
                    <Form.Text className="text-danger">
                      {errors.email.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className={formPadding}>
              <Col>
                <Form.Group controlId="bio">
                  <Form.Label>Biographical statement</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Your short biography."
                    {...register('bio')}
                  />
                  <Form.Text muted>(optional)</Form.Text>
                  {errors.bio?.message && (
                    <Form.Text className="text-danger">
                      {errors.bio.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className={formPadding}>
              <Col xs={6}>
                <Form.Group controlId="interests">
                  <Form.Label>Interests</Form.Label>
                  <Controller
                    control={control}
                    name="interests"
                    render={({ field: { onChange } }) => (
                      <Multiselect
                        options={interestNames}
                        isObject={false}
                        hidePlaceholder
                        closeOnSelect={false}
                        onSelect={onChange}
                        onRemove={onChange}
                        selectedValues={profileInterestNames}
                        key="interests-select"
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="projects">
                  <Form.Label>Products</Form.Label>
                  <Controller
                    control={control}
                    name="projects"
                    render={({ field: { onChange } }) => (
                      <Multiselect
                        options={projectNames}
                        isObject={false}
                        hidePlaceholder
                        closeOnSelect={false}
                        onSelect={onChange}
                        onRemove={onChange}
                        selectedValues={profileProjectNames}
                        key="projects-select"
                      />
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className={formPadding}>
              <Col>
                <Form.Group controlId="picture">
                  <Form.Label>Profile Picture URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter image URL"
                    {...register('picture')}
                    onChange={(e) => setPictureUrl(e.target.value)}
                  />
                  {errors.picture?.message && (
                    <Form.Text className="text-danger">
                      {errors.picture.message}
                    </Form.Text>
                  )}
                </Form.Group>
                {pictureUrl && (
                  <div className="mt-3">
                    <p>Picture Preview:</p>
                    <img
                      src={pictureUrl}
                      alt="Profile preview"
                      style={{ maxWidth: '200px', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </Col>
            </Row>
            <Row className={formPadding}>
              <Col>
                <Button variant="primary" type="submit">
                  {isNewProfile ? 'Create Profile' : 'Update Profile'}
                </Button>
              </Col>
              {!isNewProfile && (
                <Col>
                  <Button
                    variant="warning"
                    type="reset"
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfileForm;
