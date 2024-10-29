/* eslint-disable import/extensions */
import { Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { PageIDs } from '@/utilities/ids';
import pageStyle from '@/utilities/pageStyle';
import ProfileCardHelper from '../profiles/ProfileCardHelper';

const LuckyPage = async () => {
  // Fetch all profiles
  const profiles = await prisma.profile.findMany();

  // Select a random profile from the list
  const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];

  return (
    <Container id={PageIDs.profilesPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {randomProfile && (
          <ProfileCardHelper key={randomProfile.id} profile={randomProfile} />
        )}
      </Row>
    </Container>
  );
};

export default LuckyPage;
