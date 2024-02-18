import { apiRequest } from 'api/client';
import { Board } from 'types/boards';

const fetchBoard = async (id: string) => {
  const resp = await apiRequest.get<Board>(`boards/${id}`);
  return resp.data;
};

export default {
  name: 'fetchBoard',
  request: fetchBoard,
};