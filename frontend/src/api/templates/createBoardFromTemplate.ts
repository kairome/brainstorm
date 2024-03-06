import { apiRequest } from 'api/client';

const createBoardFromTemplate = async (templateId: string) => {
  const resp = await apiRequest.post<string>(`templates/${templateId}/board`);
  return resp.data;
};

export default {
  name: 'createBoardFromTemplate',
  request: createBoardFromTemplate,
};