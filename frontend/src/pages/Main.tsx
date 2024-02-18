import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { deleteFromLs, getFromLs } from 'utils/localStorage';
import Header from 'ui/Header/Header';
import Button from 'ui/Button/Button';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from 'api/user';
import Loader from 'ui/Loader/Loader';
import s from './Main.module.css';

const Main: React.FC = () => {
  const navigate = useNavigate();

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

  return (
    <div id="detail">
      <Header buttons={(<Button onClick={handleLogout}>Logout</Button>)} />
      <div className={s.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Main;