import { apiRequest } from 'api/client';

const removeAccount = async (password: string) => {
  await apiRequest.post('/user/remove', { password });
};

export default {
  name: 'removeAccount',
  request: removeAccount,
};