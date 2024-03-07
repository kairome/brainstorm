import { apiRequest } from 'api/client';

interface Payload {
  boardId?: string,
  email: string,
}

const removeMember = async (payload: Payload) => {
  await apiRequest.post<string>('/members/remove', payload);
};

export default {
  name: 'removeMember',
  request: removeMember,
};