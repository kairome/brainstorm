import { apiRequest } from 'api/client';

const setBoardFavorite = async (id: string) => {
  await apiRequest.post(`boards/${id}/favorite`);
};

export default {
  name: 'setBoardFavorite',
  request: setBoardFavorite,
};