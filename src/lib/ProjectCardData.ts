import { Profile } from '@prisma/client';

export type ProjectCardData = {
  id: number;
  name: string;
  homepage: string | null;
  picture: string | null;
  price: number;
  description: string | null;
  interests: string[];
  participants: Profile[];
  buyers: Profile[];
};
