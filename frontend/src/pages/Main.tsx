import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { deleteFromLs, getFromLs } from 'utils/localStorage';
import Header from 'ui/Header/Header';
import Button from 'ui/Button/Button';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from 'api/user';
import Loader from 'ui/Loader/Loader';

const Main: React.FC = () => {
  const navigate = useNavigate();

  const { refetch: loadUser, data: user, isLoading } = useQuery({
    queryKey: [fetchUser.name],
    queryFn: fetchUser.request,
    enabled: false,
  });

  console.log('user -> ', user);

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

  return (
    <div id="detail">
      <Header buttons={(<Button onClick={handleLogout}>Logout</Button>)} />
      {isLoading ? (<Loader />) : <Outlet />}
    </div>
  );
};

export default Main;