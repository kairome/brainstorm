import React, { useEffect, useState } from 'react';
import { BoardMember } from 'types/members';
import Modal from 'ui/Modal/Modal';
import Toggle from 'ui/Toggle/Toggle';
import _ from 'lodash';
import Button from 'ui/Button/Button';
import { IoTrashOutline, IoReloadSharp } from 'react-icons/io5';
import classNames from 'classnames';
import { useMutation } from '@tanstack/react-query';
import { updateMemberBoardsPerms } from 'api/members';
import { useNotify } from 'store/alert';
import { AxiosError } from 'axios';
import { getApiErrors } from 'utils/apiErrors';

import s from './Members.module.css';

interface Props {
  show: boolean,
  onClose: () => void,
  member: BoardMember | null,
  loadMembers: () => void,
}

type BoardPermissions = Record<string, { canEdit: boolean, removed: boolean }>;

const MemberBoardsModal: React.FC<Props> = (props) => {
  const { member } = props;
  const notify = useNotify();

  const [boardsPermissions, setBoardsPermissions] = useState<BoardPermissions>({});

  const { mutate: updatePerms, isPending: updateLoading } = useMutation({
    mutationFn: updateMemberBoardsPerms.request,
    onSuccess: () => {
      notify({
        type: 'success',
        message: 'Permissions updated!',
      });
      props.loadMembers();
      props.onClose();
    },
    onError: (err: AxiosError) => {
      const errors = getApiErrors(err);
      const msg = typeof errors === 'string' ? errors : _.map(errors, errText => errText).join(' ');
      notify({
        type: 'error',
        message: msg ? msg : 'Failed to update permissions',
      });
    },
  });

  useEffect(() => {
    if (!member) {
      setBoardsPermissions({});
      return;
    }

    const perms = _.reduce(member.boards, (acc, board) => {
      return {
        ...acc,
        [board.id]: { canEdit: board.canEdit, removed: false },
      };
    }, {});

    setBoardsPermissions(perms);

  }, [member]);

  if (!member) {
    return null;
  }

  const handleBoardPermToggle = (boardId: string, checked: boolean) => {
    const boardPerms = boardsPermissions[boardId] ?? {};
    setBoardsPermissions({
      ...boardsPermissions,
      [boardId]: {
        ...boardPerms,
        canEdit: checked,
      },
    });
  };

  const handleToggleBoardRemoval = (boardId: string) => {
    const boardPerms = boardsPermissions[boardId];
    const newPerms = boardPerms ? { ...boardPerms, removed: !boardPerms.removed } : { canEdit: false, removed: true };
    setBoardsPermissions({
      ...boardsPermissions,
      [boardId]: newPerms,
    });
  };

  const handleUpdatePermissions = () => {
    const memberBoards = _.map(boardsPermissions, (val, key) => ({
      boardId: key,
      ...val,
    }));
    const payload = {
      email: member.email,
      boards: memberBoards,
    };

    updatePerms(payload);
  };

  const renderMemberBoards = () => {
    const list = _.map(member.boards, (board) => {
      const boardPerms = boardsPermissions[board.id];
      const removed = boardPerms?.removed;
      const classes = classNames(s.memberModalBoard, {
        [s.boardRemoved]: removed,
      });

      const Icon = removed ? IoReloadSharp : IoTrashOutline;

      return (
        <div key={board.id} className={classes}>
          <div className={s.modalBoardTitle}>
            <h3>
              {board.title}
            </h3>
            <Icon
              className={removed ? s.returnIcon : s.removeModalBoard}
              onClick={() => handleToggleBoardRemoval(board.id)}
            />
          </div>
          <Toggle
            label="Can edit"
            checked={boardPerms?.canEdit ?? board.canEdit}
            onChange={checked => handleBoardPermToggle(board.id, checked)}
            disabled={removed}
          />
        </div>
      );
    });

    return (
      <>
        <div className={s.memberModalBoards}>
          {list}
        </div>
        <Button fullWidth onClick={handleUpdatePermissions} loading={updateLoading}>
          Update permissions
        </Button>
      </>
    );
  };

  return (
    <Modal
      title={`${member.name ?? member.email}'s boards`}
      show={props.show}
      onClose={props.onClose}
    >
      {renderMemberBoards()}
    </Modal>
  );
};

export default MemberBoardsModal;