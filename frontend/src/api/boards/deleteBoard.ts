import { apiRequest } from 'api/client';

const deleteBoard = async (id: string) => {
  await apiRequest.delete(`boards/${id}`);
};

export default {
  name: 'deleteBoard',
  request: deleteBoard,
};