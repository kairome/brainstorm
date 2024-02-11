import { AuthResponse, LoginPayload } from 'types/auth';
import { apiRequest } from 'api/client';

const login = async (payload: LoginPayload) => {
  const resp = await apiRequest.post<AuthResponse>('/auth/login', payload);
  return resp.data;
};

export default {
  name: 'login',
  request: login,
};