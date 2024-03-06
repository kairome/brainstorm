import { apiRequest } from 'api/client';

const createTemplate = async (boardId?: string) => {
  const resp = await apiRequest.post<string>('templates', { boardId });
  return resp.data;
};

export default {
  name: 'createTemplate',
  request: createTemplate,
};