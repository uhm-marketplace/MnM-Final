import { getServerSession } from 'next-auth';
import { Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import pageStyle from '@/utilities/pageStyle';
import { authOptions } from '@/lib/auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { ProfileCardData } from '@/lib/ProfileCardData';
import ProfileCardHelper from './ProfileCardHelper';

const ProfilesPage = async () => {
  const session = await getServerSession(authOptions);

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  // Fetch all profiles with their relationships
  const profiles = await prisma.profile.findMany();

  // Get profile data with interests and projects for each profile
  const profilesData = await Promise.all(
    profiles.map(async (profile) => {
      const [profileInterests, profileProjects] = await Promise.all([
        prisma.profileInterest.findMany({
          where: { profileId: profile.id },
          include: { interest: true },
        }),
        prisma.profileProject.findMany({
          where: { profileId: profile.id },
          include: { project: true },
        }),
      ]);

      const profileData: ProfileCardData = {
        id: profile.id,
        email: profile.email,
        bio: profile.bio,
        firstName: profile.firstName,
        lastName: profile.lastName,
        picture: profile.picture,
        title: profile.title,
        interests: profileInterests.map((pi) => pi.interest.name),
        projects: profileProjects.map((pp) => pp.project),
      };

      return profileData;
    }),
  );

  // Sort by email
  profilesData.sort((a, b) => a.email.localeCompare(b.email));

  return (
    <Container id={PageIDs.profilesPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {profilesData.map((profileData) => (
          <ProfileCardHelper key={profileData.email} profile={profileData} />
        ))}
      </Row>
    </Container>
  );
};

export default ProfilesPage;
