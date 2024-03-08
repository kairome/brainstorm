import React from 'react';
import s from 'pages/Board/Board.module.css';
import { PiArrowCircleLeftBold } from 'react-icons/pi';
import InlineInput from 'ui/Input/InlineInput';
import { useLocation, useNavigate } from 'react-router-dom';
import { TemplateItem } from 'types/template';
import Button from 'ui/Button/Button';
import { useMutation } from '@tanstack/react-query';
import { createBoardFromTemplate, updateTemplate } from 'api/templates';
import { AxiosError } from 'axios';
import { getApiErrors } from 'utils/apiErrors';
import { useNotify } from 'store/alert';

interface Props {
  template: TemplateItem,
}

const TemplateCustomPanel: React.FC<Props> = (props) => {
  const { template } = props;

  const navigate = useNavigate();
  const notify = useNotify();
  const { state } = useLocation();

  const { mutate: updateTitle } = useMutation({
    mutationFn: updateTemplate.request,
  });

  const { mutate: createBoard, isPending } = useMutation({
    mutationFn: createBoardFromTemplate.request,
    onSuccess: (boardId) => {
      navigate(`/boards/${boardId}`);
    },
    onError: (err: AxiosError) => {
      const msg = getApiErrors(err);
      notify({
        type: 'error',
        message: typeof msg === 'string' ? msg : 'Failed to create board',
      });
    },
  });

  const handleSaveTitle = (title: string) => {
    updateTitle({
      templateId: template._id,
      title,
    });
  };

  return (
    <div className={s.customControls}>
      <div className={s.customControlPanel}>
        <PiArrowCircleLeftBold
          className={s.controlPanelIcon}
          onClick={() => navigate({
            pathname: '/templates',
            search: state,
          })}
        />
        <InlineInput
          initialValue={template.title}
          onSave={handleSaveTitle}
          canEdit
        />
        <Button size="sm" onClick={() => createBoard(template._id)} loading={isPending}>
          Create board
        </Button>
      </div>
    </div>
  );
};

export default TemplateCustomPanel;