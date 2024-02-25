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

import s from './Board.module.css';

const Board: React.FC = () => {
  const { id: boardId } = useParams();

  const theme = useRecoilValue(themeState);

  const user = useRecoilValue(userState);

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

  if (isLoading || !user) {
    return (
      <div className={s.noContentContainer}>
        <Loader />
      </div>
    );
  }

  if (!board) {
    return (
      <NotFound
        text="Board not found"
      />
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
          user={user}
          board={board}
          loadBoard={loadBoard}
        />
      </Tldraw>
    </div>
  );
};

export default Board;