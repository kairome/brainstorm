import React, { useEffect, useState } from 'react';
import commonS from 'css/common.module.css';
import { useRecoilState } from 'recoil';
import { userState } from 'store/user';
import Loader from 'ui/Loader/Loader';
import Input from 'ui/Input/Input';
import Button from 'ui/Button/Button';
import _ from 'lodash';
import { useMutation } from '@tanstack/react-query';
import { changeUserPassword, removeAccount, updateUserInfo } from 'api/user';
import { AxiosError } from 'axios';
import { useNotify } from 'store/alert';
import { getApiErrors } from 'utils/apiErrors';
import { HexColorPicker } from 'react-colorful';
import { GiArrowCursor } from 'react-icons/gi';
import PasswordInput from 'ui/PasswordInput/PasswordInput';
import Card from 'ui/Card/Card';
import { deleteFromLs } from 'utils/localStorage';
import { useNavigate } from 'react-router-dom';

import s from './Account.module.css';

const AccountPage: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const notify = useNotify();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const [passwordData, setPasswordData] = useState<Record<string, string>>({});

  const [removeConfirmPass, setRemoveConfirmPass] = useState('');

  const { mutate: updateRequest, isPending, isSuccess } = useMutation({
    mutationFn: updateUserInfo.request,
    onSuccess: (data, variables) => {
      const msg = variables.name ? 'Your name is updated!' : 'Color updated!';
      notify({
        type: 'success',
        message: msg,
      });
    },
    onError: (err: AxiosError) => {
      const msg = getApiErrors(err);
      notify({
        type: 'error',
        message: typeof msg === 'string' ? msg : 'Failed to update account info',
      });
    },
  });

  const { mutate: changePassRequest, isPending: passLoading } = useMutation({
    mutationFn: changeUserPassword.request,
    onSuccess: () => {
      notify({
        type: 'success',
        message: 'Password updated!',
      });
      setPasswordData({});
    },
    onError: (err: AxiosError) => {
      const msg = getApiErrors(err);
      notify({
        type: 'error',
        message: typeof msg === 'string' ? msg : 'Failed to change password',
      });
    },
  });

  const { mutate: removeAccRequest, isPending: removeLoading } = useMutation({
    mutationFn: removeAccount.request,
    onSuccess: () => {
      deleteFromLs('token');
      navigate('/login');
      notify({
        type: 'info',
        message: 'Your account has been removed.',
      });
    },
    onError: (err: AxiosError) => {
      const msg = getApiErrors(err);
      notify({
        type: 'error',
        message: typeof msg === 'string' ? msg : 'Failed to change password',
      });
    },
  });

  useEffect(() => {
    if (user) {
      setName(user.name);

      if (user.color) {
        setColor(user.color);
      }

    }
  }, [user]);

  useEffect(() => {
    if (isSuccess && user) {
      setUser({ ...user, name, color });
    }
  }, [isSuccess]);

  const handleNameChange = () => {
    if (!name.trim()) {
      return;
    }

    updateRequest({
      name,
    });
  };

  const handleColorChange = () => {
    updateRequest({
      color,
    });
  };

  const handlePasswordChange = (field: 'current' | 'password' | 'confirmation', value: string) => {
    setPasswordData({
      ...passwordData,
      [field]: value,
    });
  };

  const handlePassChange = () => {
    changePassRequest({
      currentPassword: passwordData.current,
      newPassword: passwordData.password,
    });
  };

  const handleRemoveAccount = () => {
    removeAccRequest(removeConfirmPass);
  };

  if (!user) {
    return (
      <Loader />
    );
  }

  const { current, password, confirmation } = passwordData;

  const confirmationError = password && confirmation && password !== confirmation ? 'Passwords do not match' : undefined;

  const canChangePassword = Boolean(current && password && confirmation && password === confirmation);

  return (
    <div>
      <h1 className={commonS.pageTitle}>Account settings</h1>
      <div className={s.accountSection}>
        <Card title="Personal info" className={s.accountCard}>
          <Input
            label="Email"
            value={user.email}
            type="text"
            onChange={_.noop}
            disabled
          />
          <Input
            label="Name"
            value={name}
            type="text"
            onChange={setName}
          />
          <div className={s.cardButton}>
            <Button
              onClick={handleNameChange}
              loading={isPending}
            >
              Update name
            </Button>
          </div>
        </Card>
        <Card title="Change password" className={s.accountCard}>
          <Input
            label="Current password"
            placeholder="Enter your current password"
            type="password"
            value={passwordData.current ?? ''}
            onChange={v => handlePasswordChange('current', v)}
          />
          <PasswordInput
            label="New password"
            placeholder="Enter new password"
            value={passwordData.password ?? ''}
            onChange={v => handlePasswordChange('password', v)}
            generatePass
            autoComplete="new-password"
          />
          <PasswordInput
            label="Confirm new password"
            placeholder="Confirm new password"
            value={passwordData.confirmation ?? ''}
            error={confirmationError}
            onChange={v => handlePasswordChange('confirmation', v)}
            autoComplete="new-password"
          />
          <div className={s.cardButton}>
            <Button
              onClick={handlePassChange}
              loading={passLoading}
              disabled={!canChangePassword}
            >
              Change password
            </Button>
          </div>
        </Card>
        <Card title="Board presence" className={s.accountCard}>
          <p>How other people see you on a board</p>
          <div className={s.colorPickerCursor}>
            <div className={s.presence}>
              <GiArrowCursor color={color} size={30} />
              <div className={s.presenceName} style={{ backgroundColor: color }}>{name}</div>
            </div>
            <HexColorPicker color={color} onChange={setColor} />
          </div>
          <div className={s.cardButton}>
            <Button
              onClick={handleColorChange}
              loading={isPending}
            >
              Update color
            </Button>
          </div>
        </Card>
      </div>

      <div className={s.dangerZone}>
        <h3>Danger zone! Remove account</h3>
        <p>
          By removing the account, you will delete all the boards associated with this account, as well as all
          templates.
          This action cannot be undone!
        </p>
        <Input
          label="Enter your password to confirm"
          value={removeConfirmPass}
          type="password"
          wrapperClassName={s.confirmPass}
          onChange={setRemoveConfirmPass}
        />
        <Button
          theme="danger"
          disabled={!removeConfirmPass}
          onClick={handleRemoveAccount}
          loading={removeLoading}
        >
          Delete account
        </Button>
      </div>

    </div>
  );
};

export default AccountPage;