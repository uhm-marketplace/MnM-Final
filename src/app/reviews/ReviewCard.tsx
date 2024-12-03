'use client';

import { Card } from 'react-bootstrap';
// eslint-disable-next-line import/extensions
import TooltipImage from '@/components/TooltipImage';
import { ReviewCardData } from './ReviewCardData';

const ReviewCard = ({ review }: { review: ReviewCardData }) => (
  <Card>
    <Card.Body>
      <Card.Title style={{ marginTop: '0px' }}>
        {review.name}
      </Card.Title>
      {review.profilePictures.map((p) => (
        <TooltipImage
          className="mx-1"
          key={`profile-${p!.name}`}
          src={p?.picture ? p.picture : ''}
          name={p!.name}
          width={50}
          roundedCircle
        />
      ))}
      {review.productPictures.map((p) => (
        <TooltipImage
          className={undefined}
          key={`project-${p!.name}`}
          src={p?.picture ? p.picture : ''}
          name={p!.name}
          width={50}
          roundedCircle
        />
      ))}
    </Card.Body>
  </Card>
);
export default ReviewCard;
