import { AuthResponse, RegisterPayload } from 'types/auth';
import { apiRequest } from 'api/client';

const register = async (payload: RegisterPayload) => {
  const resp = await apiRequest.post<AuthResponse>('/auth/register', payload);
  return resp.data;
};

export default {
  name: 'register',
  request: register,
};