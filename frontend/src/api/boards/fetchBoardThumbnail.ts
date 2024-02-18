import { apiRequest } from 'api/client';

const fetchBoardThumbnail = async (id: string) => {
  const resp = await apiRequest.get<string | null>(`/files/boards/${id}/thumbnail`);
  return resp.data;
};

export default {
  name: 'fetchBoardThumbnail',
  request: fetchBoardThumbnail,
};