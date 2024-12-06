'use client';

import { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { PageIDs } from '@/utilities/ids';
import pageStyle from '@/utilities/pageStyle';
import { Profile } from '@prisma/client';
import ProfileCardHelper from './ProfileCardHelper';

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const response = await fetch('/api/profile');
      const data = await response.json();
      setProfiles(data);
    };

    fetchProfiles();

    // Optional: Set up polling for real-time updates
    const interval = setInterval(fetchProfiles, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Container id={PageIDs.profilesPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {profiles.map((profile) => (
          <ProfileCardHelper key={profile.id} profile={profile} />
        ))}
      </Row>
    </Container>
  );
};

export default ProfilesPage;
