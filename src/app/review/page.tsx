import { prisma } from '@/lib/prisma';
import { Container, Row } from 'react-bootstrap';
import { PageIDs } from '@/utilities/ids';
import pageStyle from '@/utilities/pageStyle';
import ReviewCardHelper from './ReviewCardHelper';

const ReviewPage = async () => {
  const reviews = await prisma.review.findMany();
  reviews.sort((a, b) => a.firstName.localeCompare(b.firstName));
  console.log(reviews);
  return (
    <Container id={PageIDs.interestsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {reviews.map((review) => (<ReviewCardHelper key={review.id} review={review} />))}
      </Row>
    </Container>
  );
};

export default ReviewPage;
