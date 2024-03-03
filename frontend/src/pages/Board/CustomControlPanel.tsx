import React, { useState } from 'react';
import s from 'pages/Board/Board.module.css';
import { PiArrowCircleLeftBold } from 'react-icons/pi';
import InlineInput from 'ui/Input/InlineInput';
import { useMutation } from '@tanstack/react-query';
import { updateBoard } from 'api/boards';
import { useNavigate } from 'react-router-dom';
import SetThumbnail from 'pages/Board/controlPanels/SetThumbnail';
import { User } from 'types/user';
import { BoardItem } from 'types/boards';
import ActiveUsers from 'pages/Board/controlPanels/ActiveUsers';
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import { IoShareSocial } from 'react-icons/io5';
import ShareBoardModal from 'ui/ShareBoard/ShareBoardModal';
import InviteToBoardModal from 'ui/ShareBoard/InviteToBoardModal';

interface Props {
  user: User,
  board: BoardItem,
  loadBoard: () => void,
}

const CustomControlPanel: React.FC<Props> = (props) => {
  const { board, user } = props;

  const isOwnBoard = board.author === user._id;

  const navigate = useNavigate();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { mutate: updateTitle } = useMutation({
    mutationFn: updateBoard.request,
    onSuccess: () => {
      props.loadBoard();
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
    if (!isOwnBoard) {
      return null;
    }

    const actions = [
      {
        title: 'Share board',
        onClick: () => setShowShareModal(true),
        icon: null,
      },
      {
        title: 'Invite to board',
        onClick: () => setShowInviteModal(true),
        icon: null,
      },
    ];

    return (
      <ContextMenu id="shareBoard" actions={actions} offset={25}>
        <IoShareSocial size={30} />
      </ContextMenu>
    );
  };

  return (
    <div className={s.customControls}>
      <div className={s.customControlPanel}>
        <PiArrowCircleLeftBold
          className={s.controlPanelIcon}
          onClick={() => navigate('/')}
        />
        <InlineInput
          initialValue={board.title}
          onSave={handleSaveTitle}
          canEdit={isOwnBoard}
        />
      </div>
      <div className={s.customControlPanel}>
        {renderThumbnailAction()}
        <ActiveUsers />
        {renderShareAction()}
      </div>
      <ShareBoardModal show={showShareModal} onClose={() => setShowShareModal(false)} board={board} />
      <InviteToBoardModal show={showInviteModal} onClose={() => setShowInviteModal(false)} boardId={board._id} />
    </div>
  );
};

export default CustomControlPanel;