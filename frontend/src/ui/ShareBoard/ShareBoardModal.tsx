import React, { useState } from 'react';
import Modal from 'ui/Modal/Modal';
import Toggle from 'ui/Toggle/Toggle';
import s from 'ui/ShareBoard/ShareBoard.module.css';
import Button from 'ui/Button/Button';
import { BoardItem } from 'types/boards';
import Input from 'ui/Input/Input';
import _ from 'lodash';
import { useCopyToClipboard } from 'usehooks-ts';
import TooltipNotification from 'ui/TooltipNotification/TooltipNotification';
import { TooltipNotificationState } from 'types/alert';
import { useMutation } from '@tanstack/react-query';
import { updatePublicBoardPerms } from 'api/boards';
import { useNotify } from 'store/alert';

interface Props {
  board: BoardItem,
  show: boolean,
  onClose: () => void,
}

const ShareBoardModal: React.FC<Props> = (props) => {
  const { board } = props;

  const [, copyFn] = useCopyToClipboard();

  const notify = useNotify();

  const [anonSettings, setAnonSettings] = useState(board.publicPermissions.anonUsers);
  const [registeredSettings, setRegisteredSettings] = useState(board.publicPermissions.registeredUsers);

  const [copyNotification, setCopyNotification] = useState<TooltipNotificationState | null>(null);

  const { mutate: updatePermsRequest, isPending } = useMutation({
    mutationFn: updatePublicBoardPerms.request,
    onSuccess: () => {
      notify({ type: 'success', message: 'Permissions updated!' });
    },
  });

  const handlePermChange = (type: 'view' | 'edit', value: boolean, isAnon: boolean) => {
    const newSettings = isAnon ? { ...anonSettings } : { ...registeredSettings };
    if (type === 'view') {
      newSettings.canView = value;
      newSettings.canEdit = !value ? false : newSettings.canEdit;
    }

    if (type === 'edit') {
      newSettings.canView = value ? true : newSettings.canView;
      newSettings.canEdit = value;
    }

    if (isAnon) {
      setAnonSettings(newSettings);
      setRegisteredSettings({
        canView: newSettings.canView || registeredSettings.canView,
        canEdit: newSettings.canEdit || registeredSettings.canEdit,
      });
    } else {
      setRegisteredSettings(newSettings);
    }
  };

  const handleUpdateSettings = () => {
    updatePermsRequest({
      boardId: board._id,
      anonUsers: anonSettings,
      registeredUsers: registeredSettings,
    });
  };

  const handleCopyLink = async () => {
    await copyFn(publicLink);
    setCopyNotification({ variant: 'dark', message: 'Link copied!' });
  };

  const publicLink = `${window.location.protocol}//${window.location.host}/public-access/board/${board.publicId}`;

  return (
    <Modal show={props.show} title="Share board" onClose={props.onClose}>
      <div className={s.copyWrapper}>
        <Input
          label="Link"
          type="text"
          value={publicLink}
          onChange={_.noop}
          className={s.linkInput}
          disabled
        />
        <Button
          size="sm"
          onClick={handleCopyLink}
          data-tooltip-id="copyBoardLink"
        >
          Copy
        </Button>
      </div>
      <TooltipNotification
        id="copyBoardLink"
        notification={copyNotification}
        onClose={() => setCopyNotification(null)}
        place="bottom-end"
      />
      <div className={s.section}>
        <h3 className={s.sectionTitle}>Public users</h3>
        <Toggle
          label={(<div className={s.permissionLabel}>Can view</div>)}
          checked={anonSettings.canView}
          onChange={checked => handlePermChange('view', checked, true)}
          className={s.permissionToggle}
        />
        <Toggle
          label={(<div className={s.permissionLabel}>Can edit</div>)}
          checked={anonSettings.canEdit}
          onChange={checked => handlePermChange('edit', checked, true)}
          className={s.permissionToggle}
        />
      </div>
      <div className={s.section}>
        <h3 className={s.sectionTitle}>Registered users</h3>
        <Toggle
          label={(<div className={s.permissionLabel}>Can view</div>)}
          checked={registeredSettings.canView}
          onChange={checked => handlePermChange('view', checked, false)}
          className={s.permissionToggle}
          disabled={anonSettings.canView}
        />
        <Toggle
          label={(<div className={s.permissionLabel}>Can edit</div>)}
          checked={registeredSettings.canEdit}
          onChange={checked => handlePermChange('edit', checked, false)}
          className={s.permissionToggle}
          disabled={anonSettings.canEdit}
        />
      </div>
      <div className={s.updateSettingsWrapper}>
        <Button onClick={handleUpdateSettings} loading={isPending}>
          Update settings
        </Button>
      </div>
    </Modal>
  );
};

export default ShareBoardModal;