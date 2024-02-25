import { apiRequest } from 'api/client';
import { BoardItem } from 'types/boards';

const fetchBoards = async () => {
  const resp = await apiRequest.get<BoardItem[]>('boards');
  return resp.data;
};

export default {
  name: 'fetchBoards',
  request: fetchBoards,
};