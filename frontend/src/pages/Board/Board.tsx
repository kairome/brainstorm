import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { fetchUser } from 'api/user';
import { User } from 'types/user';
import { appHeaderState } from 'store/app';
import CustomControlPanel from 'pages/Board/CustomControlPanel';
import useWsBoard from 'utils/useWsBoard';

import s from './Board.module.css';

const Board: React.FC = () => {
  const { id: boardId } = useParams();

  const theme = useRecoilValue(themeState);

  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>([fetchUser.name]);

  const store = useWsBoard((boardId as string));

  const setAppHeader = useSetRecoilState(appHeaderState);

  const { data: board, isLoading, refetch: loadBoard } = useQuery({
    queryKey: [fetchBoard.name, boardId],
    queryFn: () => fetchBoard.request(boardId ?? ''),
  });

  useEffect(() => {
    setAppHeader(false);

    return () => setAppHeader(true);
  }, []);

  useEffect(() => {
    if (user) {
      setUserPreferences({ id: user._id, isDarkMode: theme === 'dark', name: user.name });
    }
  }, [user, theme]);

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (!board) {
    return (
      <div>
        No such board found :(
        <Link to="/">Go back to all boards</Link>
      </div>
    );
  }

  const handleBoardMount = (editor: Editor) => {
    editor.updateInstanceState({ isDebugMode: false });
  };

  const overrides: TLUiOverrides = {
    helpMenu: (editor, schema) => {
      (schema[0] as TLUiMenuGroup).children.shift();
      return schema;
    },
  };

  /*
  *
  * actionsMenu: WithDefaultHelpers<NonNullable<ActionsMenuSchemaProviderProps['overrides']>>;
    actions: WithDefaultHelpers<NonNullable<ActionsProviderProps['overrides']>>;
    contextMenu: WithDefaultHelpers<NonNullable<TLUiContextMenuSchemaProviderProps['overrides']>>;
    helpMenu: WithDefaultHelpers<NonNullable<TLUiHelpMenuSchemaProviderProps['overrides']>>;
    menu: WithDefaultHelpers<NonNullable<TLUiMenuSchemaProviderProps['overrides']>>;
    toolbar: WithDefaultHelpers<NonNullable<TLUiToolbarSchemaProviderProps['overrides']>>;
    keyboardShortcutsMenu: WithDefaultHelpers<NonNullable<TLUiKeyboardShortcutsSchemaProviderProps['overrides']>>;
    tools: WithDefaultHelpers<NonNullable<TLUiToolsProviderProps['overrides']>>;
    translations: TLUiTranslationProviderProps['overrides'];*/

  return (
    <div className={s.canvas}>
      <Tldraw
        onMount={handleBoardMount}
        overrides={overrides}
        store={store}
        autoFocus
      >
        <CustomControlPanel
          boardTitle={board.title}
          boardId={board._id}
          loadBoard={loadBoard}
        />
      </Tldraw>
    </div>
  );
};

export default Board;