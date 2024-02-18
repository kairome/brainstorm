import { apiRequest } from 'api/client';
import { Board } from 'types/boards';

interface Payload {
  id: string,
  title?: string,
  customThumbnail?: boolean,
}

const updateBoard = async (payload: Payload) => {
  const { id, ...rest } = payload;
  const resp = await apiRequest.patch<Board>(`/boards/${id}`, rest);
  return resp.data;
};

export default {
  name: 'updateBoard',
  request: updateBoard,
};