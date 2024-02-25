import React from 'react';
import { TfiUser } from 'react-icons/tfi';

import s from './Avatar.module.css';

const Avatar: React.FC = () => {
  return (
    <div className={s.avatar}>
      <TfiUser />
    </div>
  );
};

export default Avatar;