import React, { useState } from 'react';
import { TemplateItem } from 'types/template';
import Card from 'ui/Card/Card';
import s from 'pages/Boards/Boards.module.css';
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import { getFormattedDate } from 'utils/dates';
import Thumbnail from 'assets/templateThumbnail.svg?react';
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import { IoEllipsisVertical, IoTrashOutline } from 'react-icons/io5';
import ConfirmationModal from 'ui/Modal/ConfirmationModal';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getApiErrors } from 'utils/apiErrors';
import { createBoardFromTemplate, deleteTemplate } from 'api/templates';
import { useNotify } from 'store/alert';
import { MdOutlineCreateNewFolder } from 'react-icons/md';

interface Props {
  template: TemplateItem,
  loadTemplates: () => void,
}

const TemplateCard: React.FC<Props> = (props) => {
  const { template } = props;
  const navigate = useNavigate();
  const notify = useNotify();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { mutate: deleteTemplateRequest, isPending: deleteLoading, isSuccess: deleteSuccess } = useMutation({
    mutationFn: deleteTemplate.request,
    onSuccess: () => {
      notify({
        type: 'success',
        message: 'Template deleted!',
      });

      props.loadTemplates();
    },
    onError: (err: AxiosError) => {
      const msg = getApiErrors(err);
      notify({
        type: 'error',
        message: typeof msg === 'string' ? msg : 'Failed to delete the template',
      });
    },
  });

  const { mutate: createBoard } = useMutation({
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

  const templateActions = [
    {
      title: 'Create board',
      icon: <MdOutlineCreateNewFolder />,
      onClick: () => {
        createBoard(template._id);
      },
    },
    {
      title: 'Delete',
      icon: <IoTrashOutline />,
      className: s.removeAction,
      onClick: () => {
        setShowDeleteConfirmation(true);
      },
    },
  ];

  return (
    <Card
      className={s.boardCard}
      onClick={() => navigate(`/templates/${template._id}`)}
    >
      <div className={s.boardContent}>
        <div className={s.boardHeader}>
          <h2
            data-tooltip-id={`${template._id}-title`}
          >
            {template.title}
          </h2>
          <Tooltip
            id={`${template._id}-title`}
            content={template.title}
            place="bottom-start"
            delayShow={1000}
            noArrow
          />
          <div className={s.boardHeaderControls}>
            <ContextMenu
              id={`template${template._id}-cardActions`}
              actions={templateActions}
              place="bottom-end"
            >
              <IoEllipsisVertical />
            </ContextMenu>
          </div>
        </div>
        <div className={s.boardStatus}>
          Modified {getFormattedDate(template.updatedAt)}
        </div>
        <div className={s.boardStatus}>
          Created {getFormattedDate(template.createdAt)}
        </div>
      </div>
      <Thumbnail className={s.thumbnail} />
      <ConfirmationModal
        title="Delete template"
        text="Are you sure you want to delete this template? This action cannot be undone."
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={() => deleteTemplateRequest(template._id)}
        isLoading={deleteLoading}
        isSuccess={deleteSuccess}
      />
    </Card>
  );
};

export default TemplateCard;