import { apiRequest } from 'api/client';

const fetchUser = async () => {
  const resp = await apiRequest.get('user');
  return resp.data;
};

export default {
  name: 'fetchUser',
  request: fetchUser,
};