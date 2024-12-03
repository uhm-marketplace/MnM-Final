export type PictureInfo = {
  name: string;
  picture: string | null;
};

export type ReviewCardData = {
  name: string;
  review: string;
  profilePictures: (PictureInfo | null)[];
  productPictures: (PictureInfo | null)[];
};
