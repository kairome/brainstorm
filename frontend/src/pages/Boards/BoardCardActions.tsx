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
import InviteToBoardModal from 'ui/ShareBoard/InviteToBoardModal';
import ShareBoardModal from 'ui/ShareBoard/ShareBoardModal';
import { BoardItem } from 'types/boards';
import { createTemplate } from 'api/templates';
import { useNavigate } from 'react-router-dom';

interface Props {
  board: BoardItem,
  isOwner: boolean,
  onSuccess: () => void,
}

const BoardCardActions: React.FC<Props> = (props) => {
  const notify = useNotify();
  const navigate = useNavigate();
  const { board, isOwner } = props;

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [showInviteToBoard, setShowInviteToBoard] = useState(false);
  const [showShareBoard, setShowShareBoard] = useState(false);

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

  const boardActions = [
    {
      title: 'Share',
      icon: <IoShareSocial />,
      forbidden: !isOwner,
      onClick: () => {
        setShowShareBoard(true);
      },
    },
    {
      title: 'Invite to board',
      icon: <IoPersonAdd />,
      forbidden: !isOwner,
      onClick: () => {
        setShowInviteToBoard(true);
      },
    },
    {
      title: 'Create template',
      icon: <IoSaveOutline />,
      onClick: () => {
        createTemplateRequest(board._id);
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
        id={`board${board._id}-cardActions`}
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
        onConfirm={() => deleteBoardRequest(board._id)}
        isLoading={deleteLoading}
        isSuccess={deleteSuccess}
      />
      <InviteToBoardModal
        boardId={board._id}
        show={showInviteToBoard}
        onClose={() => setShowInviteToBoard(false)}
      />
      <ShareBoardModal
        board={board}
        show={showShareBoard}
        onClose={() => setShowShareBoard(false)}
      />
    </>
  );
};

export default BoardCardActions;