'use client';

import { useEffect, useState } from 'react';
import { Profile } from '@prisma/client';
import { ProfileCardData } from '@/lib/ProfileCardData';
import ProfileCard from '../../components/ProfileCard';

const ProfileCardHelper = ({ profile }: { profile: Profile }) => {
  const [profileData, setProfileData] = useState<ProfileCardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`/api/profile/${profile.id}/details`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile data');
      }
    };

    fetchProfileData();
  }, [profile.id]);

  if (error) {
    return (
      <div>
        Error loading profile:
        {error}
      </div>
    );
  }
  if (!profileData) return <div>Loading...</div>;

  return <ProfileCard profile={profileData} />;
};

export default ProfileCardHelper;
