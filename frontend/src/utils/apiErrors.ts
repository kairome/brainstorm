import { AxiosError } from 'axios';
import { ApiError, ApiFormErrors } from 'types/api';
import _ from 'lodash';

export const getApiErrors = (error: AxiosError) => {
  const data = error.response?.data as ApiFormErrors | ApiError;
  if (!data) {
    return null;
  }

  if ('message' in data) {
    return data.message;
  }

  return _.reduce(data.errors, (acc, val) => {
    return {
      ...acc,
      [val.name]: val.message,
    };
  }, {}) as Record<string, string>;
};