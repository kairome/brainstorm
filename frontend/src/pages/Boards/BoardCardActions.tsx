import React, { useState } from 'react';
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import { IoEllipsisVertical, IoPersonAdd, IoSaveOutline, IoShareSocial, IoTrashOutline } from 'react-icons/io5';
import s from 'pages/Boards/Boards.module.css';
import { useMutation } from '@tanstack/react-query';
import { deleteBoard } from 'api/boards';
import { AxiosError } from 'axios';
import { getApiErrors } from 'utils/apiErrors';
import { useNotify } from 'store/alert';
import ConfirmationModal from 'ui/Modal/ConfirmationModal';

interface Props {
  boardId: string,
  isOwner: boolean,
  onSuccess: () => void,
}

const BoardCardActions: React.FC<Props> = (props) => {
  const notify = useNotify();
  const { boardId, isOwner } = props;

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { mutate: deleteBoardRequest, isPending: deleteLoading, isSuccess: deleteSuccess } = useMutation({
    mutationFn: deleteBoard.request,
    onSuccess: () => {
      notify({
        type: 'success',
        message: 'Board deleted!',
      });

      props.onSuccess();
    },
    onError: (err: AxiosError) => {
      const msg = getApiErrors(err);
      notify({
        type: 'error',
        message: typeof msg === 'string' ? msg : 'Failed to delete the board',
      });
    },
  });

  const boardActions = [
    {
      title: 'Share',
      icon: <IoShareSocial />,
      forbidden: !isOwner,
      onClick: () => {
        console.log('share');
      },
    },
    {
      title: 'Invite to board',
      icon: <IoPersonAdd />,
      forbidden: !isOwner,
      onClick: () => {
        console.log('invite');
      },
    },
    {
      title: 'Create template',
      icon: <IoSaveOutline />,
      onClick: () => {
        console.log('save as template');
      },
    },
    {
      title: 'Delete',
      icon: <IoTrashOutline />,
      className: s.removeAction,
      forbidden: !isOwner,
      onClick: () => {
        setShowDeleteConfirmation(true);
      },
    },
  ];

  return (
    <>
      <ContextMenu
        id={`board${boardId}-cardActions`}
        actions={boardActions}
        place="bottom-end"
      >
        <IoEllipsisVertical
          className={s.boardActionsIcon}
        />
      </ContextMenu>
      <ConfirmationModal
        title="Delete board"
        text="Are you sure you want to delete this board? This action cannot be undone."
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={() => deleteBoardRequest(boardId)}
        isLoading={deleteLoading}
        isSuccess={deleteSuccess}
      />
    </>
  );
};

export default BoardCardActions;