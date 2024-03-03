import { apiRequest } from 'api/client';

interface InvitePayload {
  boardId: string,
  email: string,
  canEdit: boolean,
}

const inviteToBoard = async (payload: InvitePayload) => {
  const { boardId, ...data } = payload;
  await apiRequest.post(`boards/${boardId}/invite`, data);
};

export default {
  name: 'inviteToBoard',
  request: inviteToBoard,
};