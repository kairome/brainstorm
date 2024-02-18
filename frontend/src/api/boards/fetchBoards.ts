import { apiRequest } from 'api/client';
import { Board } from 'types/boards';

const fetchBoards = async () => {
  const resp = await apiRequest.get<Board[]>('boards');
  return resp.data;
};

export default {
  name: 'fetchBoards',
  request: fetchBoards,
};