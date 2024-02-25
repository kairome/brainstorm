import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { deleteFromLs, getFromLs } from 'utils/localStorage';
import Header from 'ui/Header/Header';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from 'api/user';
import Loader from 'ui/Loader/Loader';
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import Avatar from 'ui/Avatar/Avatar';
import { IoIosLogOut } from 'react-icons/io';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { useSetRecoilState } from 'recoil';
import { userState } from 'store/user';

import s from './Main.module.css';

const Main: React.FC = () => {
  const navigate = useNavigate();

  const setUser = useSetRecoilState(userState);

  const { refetch: loadUser, data: user, isLoading } = useQuery({
    queryKey: [fetchUser.name],
    queryFn: fetchUser.request,
    enabled: false,
  });

  useEffect(() => {
    const token = getFromLs('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!user) {
      loadUser();
    }
  }, []);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  const handleLogout = () => {
    deleteFromLs('token');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className={s.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  const accountActions = [
    {
      title: 'Account',
      icon: <MdOutlineManageAccounts />,
      onClick: () => navigate('/account'),
    },
    {
      title: 'Log out',
      icon: <IoIosLogOut />,
      onClick: handleLogout,
    },
  ];

  const settings = (
    <ContextMenu
      id="account"
      actions={accountActions}
      place="bottom-end"
    >
      <Avatar />
    </ContextMenu>
  );

  return (
    <div id="detail">
      <Header buttons={settings} withMenu />
      <div className={s.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Main;