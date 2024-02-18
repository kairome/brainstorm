import { object, string } from 'yup';
import { LoginPayload, RegPayload } from '@/types/auth';
import { YupError } from '@/types/entities';
import _ from 'lodash';

const REQUIRED_MSG = 'This field is required';
const EMAIL_MSG = 'Incorrect email';

const regSchema = object({
  name: string().required(REQUIRED_MSG),
  email: string().email(EMAIL_MSG).required(REQUIRED_MSG),
  password: string().required(REQUIRED_MSG).min(8),
});

const loginSchema = object({
  email: string().email(EMAIL_MSG).required(REQUIRED_MSG),
  password: string().required(REQUIRED_MSG),
});

const mapErrors = (error: YupError) => {
  return _.map(error.inner, v => ({ name: v.path, message: v.message }));
};

export const validateRegData = async (data: RegPayload) => {
  try {
    await regSchema.validate(data, { abortEarly: false });
    return null;
  } catch (err) {
    return mapErrors(err as YupError);
  }
};

export const validateLoginData = async (data: LoginPayload) => {
  try {
    await loginSchema.validate(data, { abortEarly: false });
    return null;
  } catch (err) {
    return mapErrors(err as YupError);
  }
};