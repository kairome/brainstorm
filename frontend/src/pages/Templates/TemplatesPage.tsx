import React, { useState } from 'react';
import commonS from 'css/common.module.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createTemplate, fetchTemplates } from 'api/templates';
import ContentLoader from 'ui/Loader/ContentLoader';
import _ from 'lodash';
import boardsStyles from 'pages/Boards/Boards.module.css';
import TemplateCard from 'pages/Templates/TemplateCard';
import AddBoardLogo from 'assets/addBoard.svg?react';
import Card from 'ui/Card/Card';
import s from 'pages/Boards/Boards.module.css';
import { AxiosError } from 'axios';
import { getApiErrors } from 'utils/apiErrors';
import { useNavigate } from 'react-router-dom';
import { useNotify } from 'store/alert';
import SearchInput from 'ui/Input/SearchInput';
import { IoClose } from 'react-icons/io5';

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const notify = useNotify();

  const [searchText, setSearchText] = useState('');

  const { data: templates, isLoading, refetch: loadTemplates } = useQuery({
    queryKey: [fetchTemplates.name, searchText],
    queryFn: () => fetchTemplates.request({ search: searchText }),
  });

  const { mutate: createTemplateRequest } = useMutation({
    mutationFn: createTemplate.request,
    onSuccess: (id: string) => {
      navigate(`/templates/${id}`);
    },
    onError: (err: AxiosError) => {
      const msg = getApiErrors(err);
      notify({
        type: 'error',
        message: typeof msg === 'string' ? msg : 'Failed to create template',
      });
    },
  });

  const renderClear = () => {
    if (!searchText) {
      return null;
    }

    return (
      <div onClick={() => setSearchText('')} className={s.clearFilters}>
        <IoClose />
        Clear
      </div>
    );
  };

  const renderTemplates = () => {
    const list = _.map(templates, (template) => {
      return (
        <TemplateCard
          key={template._id}
          template={template}
          loadTemplates={loadTemplates}
        />
      );
    });

    return (
      <div className={boardsStyles.boards}>
        <Card className={s.newBoardCard} title="New template" onClick={() => createTemplateRequest(undefined)}>
          <AddBoardLogo />
        </Card>
        {list}
      </div>
    );
  };

  return (
    <ContentLoader loading={isLoading}>
      <h1 className={commonS.pageTitle}>Templates</h1>
      <div className={s.filters}>
        <SearchInput
          label="Search"
          placeholder="Search by name"
          value={searchText}
          onChange={setSearchText}
        />
        {renderClear()}
      </div>
      {renderTemplates()}
    </ContentLoader>
  );
};

export default TemplatesPage;