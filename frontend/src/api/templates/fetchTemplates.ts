import { apiRequest } from 'api/client';
import { TemplateItem } from 'types/template';

interface Filters {
  search: string,
}

const fetchTemplates = async (filters: Filters) => {
  const resp = await apiRequest.get<TemplateItem[]>('templates', {
    params: filters,
  });
  return resp.data;
};

export default {
  name: 'fetchTemplate',
  request: fetchTemplates,
};