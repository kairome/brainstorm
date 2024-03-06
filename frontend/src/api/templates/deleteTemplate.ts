import { apiRequest } from 'api/client';

const deleteTemplate = async (templateId: string) => {
  await apiRequest.delete(`templates/${templateId}`);
};

export default {
  name: 'deleteTemplate',
  request: deleteTemplate,
};