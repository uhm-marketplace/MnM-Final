import * as Yup from 'yup';

export interface IProject {
  name: string;
  homepage?: string;
  picture?: string;
  price: number;
  description: string;
  interests?: (string | undefined)[] | undefined;
  participants?: (string | undefined)[] | undefined;
  buyers?: (string | undefined)[] | undefined;
}

export const AddProjectSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  homepage: Yup.string().optional().url('Homepage must be a valid URL'),
  picture: Yup.string().optional(),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be positive'),
  description: Yup.string().required('Description is required'),
  interests: Yup.array().of(Yup.string()),
  participants: Yup.array().of(Yup.string()),
  buyers: Yup.array().of(Yup.string()),
});

export interface IProfile {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  interests?: (string | undefined)[] | undefined;
  projects?: (string | undefined)[] | undefined;
  picture?: string | null;
}

export const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .required('Email is required')
    .email('Email must be a valid email'),
  bio: Yup.string()
    .required('Bio is required'),
  interests: Yup.array().of(Yup.string()),
  projects: Yup.array().of(Yup.string()),
  picture: Yup.string()
    .required('Profile picture URL is required')
    .url('Must be a valid URL'),
});
