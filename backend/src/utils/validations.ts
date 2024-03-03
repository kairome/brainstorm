import { boolean, object, string } from 'yup';
import { LoginPayload, RegPayload } from '@/types/auth';
import { YupError } from '@/types/entities';
import _ from 'lodash';
import { PublicBoardPermissions } from '@/types/boards';

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

const emailSchema = object({
  email: string().email(EMAIL_MSG).required(REQUIRED_MSG),
});

const publicBoardPermissionsSchema = object({
  anonUsers: object({
    canView: boolean().required(REQUIRED_MSG),
    canEdit: boolean().required(REQUIRED_MSG),
  }),
  registeredUsers: object({
    canView: boolean().required(REQUIRED_MSG),
    canEdit: boolean().required(REQUIRED_MSG),
  })
});

const mapErrors = (error: YupError) => {
  return _.map(error.inner, v => ({ name: v.path, message: v.message }));
};

export const validateRegData = async (data: RegPayload) => {
  try {
    const validatedData = await regSchema.validate(data, { abortEarly: false, stripUnknown: true });
    return {
      data: validatedData,
      errors: null,
    };
  } catch (err) {
    const errors = mapErrors(err as YupError);
    return {
      data: null,
      errors,
    };
  }
};

export const validateLoginData = async (data: LoginPayload) => {
  try {
    const validatedData = await loginSchema.validate(data, { abortEarly: false, stripUnknown: true });
    return {
      data: validatedData,
      errors: null,
    };
  } catch (err) {
    const errors = mapErrors(err as YupError);
    return {
      data: null,
      errors,
    };
  }
};

export const validateEmail = async (email: string) => {
  try {
    const validatedData = await emailSchema.validate({ email }, { abortEarly: false });
    return {
      data: validatedData,
      errors: null,
    };
  } catch (err) {
    const errors = mapErrors(err as YupError);
    return {
      data: null,
      errors,
    };
  }
};

export const validatePublicBoardPermissions = async (data: PublicBoardPermissions) => {
  try {
    const validatedData = await publicBoardPermissionsSchema.validate(data, { abortEarly: false, stripUnknown: true });
    return {
      data: validatedData,
      errors: null,
    };
  } catch (err) {
    const errors = mapErrors(err as YupError);
    return {
      data: null,
      errors,
    };
  }
};