import React, { useEffect, useState } from 'react';
import Modal from 'ui/Modal/Modal';
import Input from 'ui/Input/Input';
import Toggle from 'ui/Toggle/Toggle';
import Form from 'ui/Form/Form';
import { useMutation } from '@tanstack/react-query';
import { inviteToBoard } from 'api/boards';
import { useNotify } from 'store/alert';
import { AxiosError } from 'axios';
import { getApiErrors } from 'utils/apiErrors';

import s from './ShareBoard.module.css';

interface Props {
  show: boolean,
  boardId: string,
  onClose: () => void,
}

const InviteToBoardModal: React.FC<Props> = (props) => {
  const [email, setEmail] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const notify = useNotify();

  const { mutate: inviteRequest, isPending } = useMutation({
    mutationFn: inviteToBoard.request,
    onSuccess: () => {
      notify({ type: 'success', message: 'Invited!' });
      props.onClose();
    },
    onError: (err: AxiosError) => {
      const msg = getApiErrors(err);
      notify({ type: 'error', message: typeof msg === 'string' ? msg : 'Failed to send invitation' });
    },
  });

  useEffect(() => {
    if (!props.show) {
      setEmail('');
      setCanEdit(false);
    }
  }, [props.show]);

  const handleInvite = () => {
    inviteRequest({
      email,
      canEdit,
      boardId: props.boardId,
    });
  };

  return (
    <Modal title="Invite to board" show={props.show} onClose={props.onClose}>
      <Form
        id="inviteToBoard"
        onSubmit={handleInvite}
        submitBtn="Send invitation"
        loading={isPending}
      >
        <Input
          label="Email"
          type="email"
          placeholder="some@example.com"
          value={email}
          onChange={setEmail}
          className={s.inviteEmailField}
          required
        />
        <Toggle
          label={(<div className={s.permissionLabel}>Can edit</div>)}
          checked={canEdit}
          onChange={setCanEdit}
        />
      </Form>
    </Modal>
  );
};

export default InviteToBoardModal;