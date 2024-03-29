import React, { useState } from 'react';
import s from 'pages/Board/Board.module.css';
import { PiArrowCircleLeftBold } from 'react-icons/pi';
import InlineInput from 'ui/Input/InlineInput';
import { useMutation } from '@tanstack/react-query';
import { updateBoard } from 'api/boards';
import { useLocation, useNavigate } from 'react-router-dom';
import SetThumbnail from 'pages/Board/controlPanels/SetThumbnail';
import { User } from 'types/user';
import { BoardItem } from 'types/boards';
import ActiveUsers from 'pages/Board/controlPanels/ActiveUsers';
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import { IoShareSocial } from 'react-icons/io5';
import ShareBoardModal from 'ui/ShareBoard/ShareBoardModal';
import InviteToBoardModal from 'ui/ShareBoard/InviteToBoardModal';
import { createTemplate } from 'api/templates';
import { AxiosError } from 'axios';
import { getApiErrors } from 'utils/apiErrors';
import { useNotify } from 'store/alert';
import BoardChat from 'pages/Board/controlPanels/BoardChat';

interface Props {
  user: User,
  board: BoardItem,
}

const CustomControlPanel: React.FC<Props> = (props) => {
  const { board, user } = props;

  const isOwnBoard = board.author === user._id;

  const navigate = useNavigate();

  const { state } = useLocation();

  const notify = useNotify();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { mutate: updateTitle } = useMutation({
    mutationFn: updateBoard.request,
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

  const handleSaveTitle = (value: string) => {
    updateTitle({
      id: board._id,
      title: value,
    });
  };

  const renderThumbnailAction = () => {
    if (!isOwnBoard) {
      return null;
    }

    return (
      <SetThumbnail boardId={board._id} />
    );
  };

  const renderShareAction = () => {
    const actions = [
      {
        title: 'Share board',
        onClick: () => setShowShareModal(true),
        icon: null,
        forbidden: !isOwnBoard,
      },
      {
        title: 'Invite to board',
        onClick: () => setShowInviteModal(true),
        icon: null,
        forbidden: !isOwnBoard,
      },
      {
        title: 'Create template',
        onClick: () => {
          createTemplateRequest(board._id);
        },
        icon: null,
      },
    ];

    return (
      <ContextMenu id="shareBoard" actions={actions} offset={25}>
        <IoShareSocial className={s.contextIcon} />
      </ContextMenu>
    );
  };

  return (
    <div className={s.customControls}>
      <div className={s.customControlPanel}>
        <PiArrowCircleLeftBold
          className={s.controlPanelIcon}
          onClick={() => navigate({
            pathname: '/',
            search: state,
          })}
        />
        <InlineInput
          initialValue={board.title}
          onSave={handleSaveTitle}
          canEdit={isOwnBoard}
        />
      </div>
      <div className={s.controlPanelActions}>
        {renderThumbnailAction()}
        <ActiveUsers />
        {renderShareAction()}
        <BoardChat board={board} />
      </div>
      <ShareBoardModal show={showShareModal} onClose={() => setShowShareModal(false)} board={board} />
      <InviteToBoardModal show={showInviteModal} onClose={() => setShowInviteModal(false)} boardId={board._id} />
    </div>
  );
};

export default CustomControlPanel;