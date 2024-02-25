import { apiRequest } from 'api/client';
import { BoardItem } from 'types/boards';

const fetchBoard = async (id: string) => {
  const resp = await apiRequest.get<BoardItem>(`boards/${id}`);
  return resp.data;
};

export default {
  name: 'fetchBoard',
  request: fetchBoard,
};