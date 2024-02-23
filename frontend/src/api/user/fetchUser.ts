import { apiRequest } from 'api/client';
import { User } from 'types/user';

const fetchUser = async () => {
  const resp = await apiRequest.get<User>('user');
  return resp.data;
};

export default {
  name: 'fetchUser',
  request: fetchUser,
};