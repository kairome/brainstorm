import { apiRequest } from 'api/client';

const addBoard = async () => {
  const resp = await apiRequest.post<string>('/boards');
  return resp.data;
};

export default {
  name: 'addBoard',
  request: addBoard,
};