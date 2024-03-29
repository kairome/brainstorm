import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBoard } from 'api/boards';
import Loader from 'ui/Loader/Loader';
import {
  Editor,
  setUserPreferences,
  Tldraw,
  TLUiMenuGroup,
  TLUiOverrides,
} from '@tldraw/tldraw';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { themeState } from 'store/theme';
import { appHeaderState } from 'store/app';
import CustomControlPanel from 'pages/Board/CustomControlPanel';
import useWsBoard from 'utils/useWsBoard';
import { userState } from 'store/user';
import NotFound from 'ui/NotFound/NotFound';
import _ from 'lodash';

import s from './Board.module.css';

const Board: React.FC = () => {
  const { id: boardId } = useParams();

  const theme = useRecoilValue(themeState);

  const user = useRecoilValue(userState);

  const { store, initialized } = useWsBoard((boardId as string));

  const setAppHeader = useSetRecoilState(appHeaderState);

  const { data: board, isLoading, isFetched } = useQuery({
    queryKey: [fetchBoard.name, boardId],
    queryFn: () => fetchBoard.request(boardId ?? ''),
  });

  useEffect(() => {
    setAppHeader(false);

    return () => {
      setAppHeader(true);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setUserPreferences({
        id: user._id,
        isDarkMode: theme === 'dark',
        name: user.name,
        color: user.color,
      });
    }
  }, [user, theme]);

  if (!board && isFetched) {
    return (
      <NotFound
        text="Board not found"
      />
    );
  }

  if (isLoading || !user || !initialized || !board) {
    return (
      <div className={s.noContentContainer}>
        <Loader />
      </div>
    );
  }

  const invited = _.find(board.invitedUsers, u => u.userId === user._id);

  if (!invited && board.author !== user._id) {
    return (
      <NotFound
        text="You are not invited to this board"
      />
    );
  }

  const handleBoardMount = (editor: Editor) => {
    const updates: any = { isDebugMode: false };

    const invitedUser = _.find(board.invitedUsers, u => u.userId === user._id);
    if ((!invitedUser || !invitedUser.canEdit) && board.author !== user._id) {
      updates.isReadonly = true;
    }

    editor.updateInstanceState(updates);
  };

  const overrides: TLUiOverrides = {
    helpMenu: (editor, schema) => {
      (schema[0] as TLUiMenuGroup).children.shift();
      return schema;
    },
  };

  return (
    <div className={s.canvas}>
      <Tldraw
        onMount={handleBoardMount}
        overrides={overrides}
        store={store}
      >
        <CustomControlPanel
          user={user}
          board={board}
        />
      </Tldraw>
    </div>
  );
};

export default Board;