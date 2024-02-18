import React from 'react';
import s from 'pages/Board/Board.module.css';
import { PiArrowCircleLeftBold } from 'react-icons/pi';
import InlineInput from 'ui/Input/InlineInput';
import Button from 'ui/Button/Button';
import { useMutation } from '@tanstack/react-query';
import { updateBoard } from 'api/boards';
import { useNavigate } from 'react-router-dom';
import SetThumbnail from 'pages/Board/controlPanels/SetThumbnail';

interface Props {
  boardTitle: string,
  boardId: string,
  loadBoard: () => void,
}

const CustomControlPanel: React.FC<Props> = (props) => {
  const { boardId, boardTitle } = props;

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
      id: boardId,
      title: value,
    });
  };

  return (
    <div className={s.customControls}>
      <div className={s.customControlPanel}>
        <PiArrowCircleLeftBold
          className={s.controlPanelIcon}
          onClick={() => navigate('/')}
        />
        <InlineInput
          initialValue={boardTitle}
          onSave={handleSaveTitle}
        />
        <Button
          size="sm"
          onClick={handleShare}
        >
          Share
        </Button>
      </div>
      <SetThumbnail boardId={boardId} />
    </div>
  );
};

export default CustomControlPanel;