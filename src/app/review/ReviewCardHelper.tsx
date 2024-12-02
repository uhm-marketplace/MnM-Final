import { Review } from '@prisma/client';
// eslint-disable-next-line import/extensions
import { prisma } from '@/lib/prisma';
import ReviewCard from './ReviewCard';

const ReviewCardHelper = async ({ review }: { review: Review }) => {
  const profileReview = await prisma.profileReview.findMany({
    where: { reviewId: review.id },
  });
  // console.log('profileInterests: ', profileInterests);
  const profiles = await prisma.profile.findMany({
    where: { id: { in: profileReview.map((profile) => profile.profileId) } },
  });
  // console.log('profiles: ', profiles);
  const profileImages = profiles.map((profile) => ({ name: profile.email, picture: profile.picture }));
  // console.log('profileImages: ', profileImages);
  const productReview = await prisma.productReview.findMany({
    where: { reviewId: review.id },
  });
  const product = await prisma.project.findMany({
    where: { id: { in: productReview.map((preview) => preview.productId) } },
  });
  // console.log('projects: ', projects);
  const projectImages = product.map((productim) => ({ name: productim.name, picture: productim.picture }));
  // console.log('projectImages: ', projectImages);
  const reviewData = {
    name: review.name,
    profilePictures: profileImages,
    projectPictures: projectImages,
  };
  return <ReviewCard review={reviewData} />;
};

export default ReviewCardHelper;
