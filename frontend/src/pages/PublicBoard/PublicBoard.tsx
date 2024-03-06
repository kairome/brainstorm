import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPublicBoard } from 'api/boards';
import Loader from 'ui/Loader/Loader';
import NotFound from 'ui/NotFound/NotFound';
import { fetchUser } from 'api/user';
import { getFromLs } from 'utils/localStorage';
import { Editor, setUserPreferences, Tldraw, TLUiMenuGroup, TLUiOverrides } from '@tldraw/tldraw';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { themeState } from 'store/theme';
import useWsBoard from 'utils/useWsBoard';
import CustomPublicControlPanel from 'pages/Board/CustomPublicControlPanel';
import _ from 'lodash';
import { userState } from 'store/user';
import { v4 } from 'uuid';

import s from './PublicBoard.module.css';

const PublicBoard: React.FC = () => {
  const { id } = useParams();

  const theme = useRecoilValue(themeState);

  const setUser = useSetRecoilState(userState);

  const token = getFromLs('token');

  const anonUserId = useMemo(() => v4(), []);

  const { data: publicBoard, isPending, isFetched } = useQuery({
    queryKey: [fetchPublicBoard.name, id],
    queryFn: () => fetchPublicBoard.request(id ?? ''),
  });

  const { refetch: loadUser, data: user, isLoading: userLoading, isFetched: userFetched } = useQuery({
    queryKey: [fetchUser.name],
    queryFn: fetchUser.request,
    enabled: false,
  });

  const { store, initialized } = useWsBoard(publicBoard?._id ?? '', true, anonUserId);

  useEffect(() => {
    if (!token) {
      return;
    }

    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (!userFetched && token) {
      return;
    }

    setUserPreferences({
      id: user?._id ?? anonUserId,
      isDarkMode: theme === 'dark',
      name: user?.name ?? 'Anonymous',
    });
  }, [user, userFetched, theme]);

  if (!publicBoard && isFetched) {
    return (
      <NotFound
        text="Board not found"
      />
    );
  }

  if (isPending || userLoading || !initialized || !publicBoard) {
    return (
      <div className={s.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  const { anonUsers, registeredUsers } = publicBoard.publicPermissions;

  if (!registeredUsers.canView && !anonUsers.canView) {
    return (
      <NotFound
        text="The owner restricted access to this board"
      />
    );
  }

  if (!anonUsers.canView && !user) {
    return (
      <NotFound
        text="Only registered users can view this board"
        link="/login"
        linkText="Log in"
        returnToOriginalUrl
      />
    );
  }

  const handleBoardMount = (editor: Editor) => {
    const updates = {
      isDebugMode: false,
      isReadonly: user ? !registeredUsers.canEdit : !anonUsers.canEdit,
    };

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
        <CustomPublicControlPanel
          board={publicBoard}
          isUserAnonymous={_.isNil(user)}
        />
      </Tldraw>
    </div>
  );
};

export default PublicBoard;