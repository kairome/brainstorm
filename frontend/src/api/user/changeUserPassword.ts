import { apiRequest } from 'api/client';

interface Payload {
  currentPassword: string,
  newPassword: string,
}

const changeUserPassword = async (payload: Payload) => {
  await apiRequest.patch('/user/password', payload);
};

export default {
  name: 'changeUserPassword',
  request: changeUserPassword,
};