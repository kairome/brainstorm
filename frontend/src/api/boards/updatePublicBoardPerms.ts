import { apiRequest } from 'api/client';
import { PublicBoardPermissions } from 'types/boards';

interface PermsPayload extends PublicBoardPermissions {
  boardId: string,
}

const updatePublicBoardPerms = async (payload: PermsPayload) => {
  const { boardId, ...data } = payload;
  await apiRequest.patch(`boards/${boardId}/public-perms`, data);
};

export default {
  name: 'updatePublicBoardPerms',
  request: updatePublicBoardPerms,
};