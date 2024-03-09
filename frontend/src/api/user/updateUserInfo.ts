import { apiRequest } from 'api/client';

interface Payload {
  name?: string,
  color?: string,
}

const updateUserInfo = async (payload: Payload) => {
  await apiRequest.patch('user', payload);
};

export default {
  name: 'updateUserInfo',
  request: updateUserInfo,
};