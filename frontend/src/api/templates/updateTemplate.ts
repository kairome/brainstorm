import { apiRequest } from 'api/client';

interface Payload {
  templateId: string,
  snapshot?: any,
  title?: string,
}

const updateTemplate = async (payload: Payload) => {
  const { templateId, ...data } = payload;
  await apiRequest.patch(`templates/${templateId}`, data);
};

export default {
  name: 'updateTemplate',
  request: updateTemplate,
};