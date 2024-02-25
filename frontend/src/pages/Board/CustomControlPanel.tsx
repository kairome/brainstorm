import React from 'react';
import s from 'pages/Board/Board.module.css';
import { PiArrowCircleLeftBold } from 'react-icons/pi';
import InlineInput from 'ui/Input/InlineInput';
import Button from 'ui/Button/Button';
import { useMutation } from '@tanstack/react-query';
import { updateBoard } from 'api/boards';
import { useNavigate } from 'react-router-dom';
import SetThumbnail from 'pages/Board/controlPanels/SetThumbnail';
import { User } from 'types/user';
import { BoardItem } from 'types/boards';

interface Props {
  user: User,
  board: BoardItem,
  loadBoard: () => void,
}

const CustomControlPanel: React.FC<Props> = (props) => {
  const { board, user } = props;

  const isOwnBoard = board.author === user._id;

  const navigate = useNavigate();

  const { mutate: updateTitle } = useMutation({
    mutationFn: updateBoard.request,
    onSuccess: () => {
      props.loadBoard();
    },
  });

  const handleShare = () => {
    console.log('share link');
  };

  const handleSaveTitle = (value: string) => {
    updateTitle({
      id: board._id,
      title: value,
    });
  };

  const renderShareButton = () => {
    if (!isOwnBoard) {
      return null;
    }

    return (
      <Button
        size="sm"
        onClick={handleShare}
      >
        Share
      </Button>
    );
  };

  const renderThumbnailAction = () => {
    if (!isOwnBoard) {
      return null;
    }

    return (
      <SetThumbnail boardId={board._id} />
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
        {renderShareButton()}
      </div>
      {renderThumbnailAction()}
    </div>
  );
};

export default CustomControlPanel;