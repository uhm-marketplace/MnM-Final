import { Profile } from '@prisma/client';

export type ProductCardData = {
  name: string;
  picture: string | null;
  price: number | null;
  description: string | null;
  owner: Profile;
};
