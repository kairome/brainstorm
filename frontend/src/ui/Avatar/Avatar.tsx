import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchUser } from 'api/user';
import { User } from 'types/user';
import { TfiUser } from 'react-icons/tfi';

import s from './Avatar.module.css';

const Avatar: React.FC = () => {
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<User>([fetchUser.name]);

  return (
    <div className={s.avatar}>
      <TfiUser />
    </div>
  );
};

export default Avatar;