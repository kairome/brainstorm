import React from 'react';
import s from 'pages/Board/Board.module.css';
import { PiArrowCircleLeftBold } from 'react-icons/pi';
import InlineInput from 'ui/Input/InlineInput';
import { useNavigate } from 'react-router-dom';
import { PublicBoardItem } from 'types/boards';
import ActiveUsers from 'pages/Board/controlPanels/ActiveUsers';
import _ from 'lodash';

interface Props {
  board: PublicBoardItem,
  isUserAnonymous: boolean,
}

const CustomPublicControlPanel: React.FC<Props> = (props) => {
  const { board, isUserAnonymous } = props;
  const navigate = useNavigate();

  return (
    <div className={s.customControls}>
      <div className={s.customControlPanel}>
        <PiArrowCircleLeftBold
          className={s.controlPanelIcon}
          onClick={() => navigate(isUserAnonymous ? '/login' : '/')}
        />
        <InlineInput
          initialValue={board.title}
          onSave={_.noop}
          canEdit={false}
        />
      </div>
      <div className={s.customControlPanel}>
        <ActiveUsers />
      </div>
    </div>
  );
};

export default CustomPublicControlPanel;