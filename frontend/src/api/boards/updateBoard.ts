import { apiRequest } from 'api/client';
import { BoardItem } from 'types/boards';

interface Payload {
  id: string,
  title?: string,
  customThumbnail?: boolean,
}

const updateBoard = async (payload: Payload) => {
  const { id, ...rest } = payload;
  const resp = await apiRequest.patch<BoardItem>(`/boards/${id}`, rest);
  return resp.data;
};

export default {
  name: 'updateBoard',
  request: updateBoard,
};