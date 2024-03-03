import { apiRequest } from 'api/client';
import { PublicBoardItem } from 'types/boards';

const fetchPublicBoard = async (publicId: string) => {
  const resp = await apiRequest.get<PublicBoardItem>(`boards/public/${publicId}`);
  return resp.data;
};

export default {
  name: 'fetchPublicBoard',
  request: fetchPublicBoard,
};