import * as Yup from 'yup';

export interface IProject {
  name: string;
  homepage?: string;
  picture?: string;
  description: string;
  price: number;
  interests?: (string | undefined)[] | undefined;
  participants?: (string | undefined)[] | undefined;
}

export const AddProjectSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  homepage: Yup.string().optional().url('Homepage must be a valid URL'),
  picture: Yup.string().optional(),
  description: Yup.string().required('Description is required'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be non-negative')
    .typeError('Price must be a number'),
  interests: Yup.array().of(Yup.string()),
  participants: Yup.array().of(Yup.string()),
});

export default AddProjectSchema;
