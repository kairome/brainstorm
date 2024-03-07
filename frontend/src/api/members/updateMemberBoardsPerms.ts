import { apiRequest } from 'api/client';

interface Payload {
  email: string,
  boards: {
    boardId: string,
    canEdit: boolean,
    removed: boolean,
  }[],
}

const updateMemberBoardsPerms = async (payload: Payload) => {
  await apiRequest.patch('/members/board-permissions', payload);
};

export default {
  name: 'updateMemberBoardsPerms',
  request: updateMemberBoardsPerms,
};