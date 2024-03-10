import React, { useEffect, useRef, useState } from 'react';
import s from 'pages/Board/Board.module.css';
import { PiUsersThree } from 'react-icons/pi';
import { useEditor, TLInstancePresence } from '@tldraw/tldraw';
import _ from 'lodash';
import { useRecoilValue } from 'recoil';
import { userState } from 'store/user';
import { SerializedStore } from '@tldraw/store';
import { useOnClickOutside } from 'usehooks-ts';

interface ActiveUser {
  id: string,
  name: string,
  color: string,
}

const ActiveUsers: React.FC = () => {
  const currentUser = useRecoilValue(userState);
  const editor = useEditor();
  const panelRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<Record<string, ActiveUser>>({});

  const [showPanel, setShowPanel] = useState(false);

  useOnClickOutside(panelRef, () => setShowPanel(false));

  useEffect(() => {
    const presenceStore = editor.store.getSnapshot('presence').store as SerializedStore<TLInstancePresence>;
    const newUsers = { ...users };
    _.forEach(presenceStore, (record) => {
      newUsers[record.userId] = {
        id: record.userId,
        name: record.userName,
        color: record.color,
      };
    });
    setUsers(newUsers);

    const unsub = editor.store.listen((event) => {
      if (!_.isEmpty(event.changes.added)) {
        const addedUsers: any = {};
        _.forEach(event.changes.added as any, (record: TLInstancePresence) => {
          addedUsers[record.userId] = {
            id: record.userId,
            name: record.userName,
            color: record.color,
          };
        });

        setUsers(prevUsers => ({ ...prevUsers, ...addedUsers }));
      }

      if (!_.isEmpty(event.changes.removed)) {
        setUsers((prevUsers) => {
          const updatedUsers = { ...prevUsers };
          _.forEach(event.changes.removed as any, (record: TLInstancePresence) => {
            delete updatedUsers[record.userId];
          });

          return updatedUsers;
        });
      }
    }, {
      scope: 'presence',
    });

    return () => unsub();
  }, []);

  const handleFollow = (userId: string, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return;
    }
    editor.stopFollowingUser();
    editor.startFollowingUser(userId);
    setShowPanel(false);
  };

  const handleNavigate = (userId: string, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return;
    }

    editor.animateToUser(userId);
  };

  const renderList = () => {
    if (_.isEmpty(users) || !showPanel) {
      return null;
    }

    const userList = _.map(users, (u) => {
      const isCurrentUser = Boolean(currentUser && currentUser._id === u.id);
      const userName = isCurrentUser ? 'You' : u.name;
      return (
        <div
          key={u.id}
          className={s.activeUserItem}
          onClick={() => handleNavigate(u.id, isCurrentUser)}
          onDoubleClick={() => handleFollow(u.id, isCurrentUser)}
        >
          <div className={s.activeUserIcon} style={{ backgroundColor: u.color }}>{u.name[0].toUpperCase()}</div>
          <div className={s.userName}>{userName}</div>
        </div>
      );
    });

    return (
      <div className={s.panelUsers}>
        {userList}
      </div>
    );
  };

  return (
    <div className={s.panelContainer} ref={panelRef}>
      <div className={s.controlPanelTrigger} onClick={() => setShowPanel(!showPanel)}>
        <PiUsersThree className={s.contextIcon} />
      </div>
      {renderList()}
    </div>
  );
};

export default ActiveUsers;