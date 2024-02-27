import { apiRequest } from 'api/client';
import { BoardFiltersPayload, BoardItem } from 'types/boards';

const fetchBoards = async (filters: BoardFiltersPayload) => {
  const resp = await apiRequest.get<BoardItem[]>('boards', {
    params: filters,
  });
  return resp.data;
};

export default {
  name: 'fetchBoards',
  request: fetchBoards,
};