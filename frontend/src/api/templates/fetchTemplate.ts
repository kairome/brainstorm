import { apiRequest } from 'api/client';
import { TemplateItem } from 'types/template';

const fetchTemplate = async (id: string) => {
  const resp = await apiRequest.get<TemplateItem>(`templates/${id}`);
  return resp.data;
};

export default {
  name: 'fetchTemplate',
  request: fetchTemplate,
};