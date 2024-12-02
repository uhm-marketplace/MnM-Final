export type PictureInfo = {
  name: string;
  picture: string | null;
};

export type ReviewCardData = {
  name: string;
  profilePictures: (PictureInfo | null)[];
  projectPictures: (PictureInfo | null)[];
};
