export type PictureInfo = {
  name: string;
  picture: string | null;
};

export type ReviewCardData = {
  firstName: string;
  lastName: string;
  review: string;
  profilePictures: (PictureInfo | null)[];
  productPictures: (PictureInfo | null)[];
};
