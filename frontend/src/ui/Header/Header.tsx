import React from 'react';
import ThemeSwitch from 'ui/ThemeSwitch/ThemeSwitch';

import s from './Header.module.css';

interface Props {
  buttons?: React.ReactNode,
}

const Header: React.FC<Props> = (props) => {
  return (
    <div className={s.header}>
      <div className={s.headerContent}>
        <div className={s.logo} />
        <div className={s.headerControls}>
          <ThemeSwitch />
          {props.buttons}
        </div>
      </div>
    </div>
  );
};

export default Header;