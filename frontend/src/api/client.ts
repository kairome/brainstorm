import { deleteFromLs, getFromLs } from 'utils/localStorage';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import _ from 'lodash';

const createRequest = (baseURL: string) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  return axios.create({
    baseURL,
    withCredentials: false,
    headers,
  });
};

export const apiUrl = `${import.meta.env.VITE_API_URL}/api`;
export const apiRequest = createRequest(apiUrl);

const requestInterceptor = (request: AxiosRequestConfig) => {
  const token = getFromLs('token');
  if (token) {
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    } as any;
  }

  return request as any;
};

const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401 && !_.includes(window.location.pathname, '/public-access/board')) {
    deleteFromLs('token');
    window.location.href = '/login';

    throw error;
  }

  throw error;
};

apiRequest.interceptors.request.use(requestInterceptor, error => Promise.reject(error));
apiRequest.interceptors.response.use(response => response, responseErrorInterceptor);