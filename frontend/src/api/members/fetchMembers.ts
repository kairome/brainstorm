import { apiRequest } from 'api/client';
import { BoardMember } from 'types/members';

const fetchMembers = async () => {
  const resp = await apiRequest.get<BoardMember[]>('members');
  return resp.data;
};

export default {
  name: 'fetchMembers',
  request: fetchMembers,
};