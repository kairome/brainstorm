import React from 'react';
import ThemeSwitch from 'ui/ThemeSwitch/ThemeSwitch';
import LogoLight from 'assets/brainStormLogo.svg?react';
import LogoDark from 'assets/brainStormLogoDark.svg?react';
import { useRecoilValue } from 'recoil';
import { themeState } from 'store/theme';

import s from './Header.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { appHeaderState } from 'store/app';

interface Props {
  buttons?: React.ReactNode,
}

const Header: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const theme = useRecoilValue(themeState);

  const showHeader = useRecoilValue(appHeaderState);

  if (!showHeader) {
    return null;
  }

  const LogoCmp = theme === 'dark' ? LogoDark : LogoLight;

  return (
    <div className={s.header}>
      <div className={s.headerContent}>
        <LogoCmp className={s.logo} onClick={() => navigate('/')} />
        <div className={s.headerControls}>
          <ThemeSwitch />
          {props.buttons}
        </div>
      </div>
    </div>
  );
};

export default Header;