import { apiRequest } from 'api/client';

interface Payload {
  boardId: string,
  thumbnail: Blob,
}

const setBoardThumbnail = async (payload: Payload) => {
  const { boardId, thumbnail } = payload;
  const formData = new FormData();
  formData.append('thumbnail', thumbnail);
  await apiRequest.post(`/files/boards/${boardId}/thumbnail`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default {
  name: 'setBoardThumbnail',
  request: setBoardThumbnail,
};