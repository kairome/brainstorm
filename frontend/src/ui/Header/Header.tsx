import React from 'react';
import ThemeSwitch from 'ui/ThemeSwitch/ThemeSwitch';
import LogoLight from 'assets/brainStormLogo.svg?react';
import LogoDark from 'assets/brainStormLogoDark.svg?react';
import { useRecoilValue } from 'recoil';
import { themeState } from 'store/theme';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { appHeaderState } from 'store/app';
import _ from 'lodash';
import classNames from 'classnames';
import { TbCards } from 'react-icons/tb';
import { LuBookTemplate } from 'react-icons/lu';
import { HiOutlineUserGroup } from 'react-icons/hi2';

import s from './Header.module.css';

interface Props {
  buttons?: React.ReactNode,
  withMenu?: boolean,
}

const Header: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const theme = useRecoilValue(themeState);
  const { pathname } = useLocation();

  const showHeader = useRecoilValue(appHeaderState);

  if (!showHeader) {
    return null;
  }

  const renderMenu = () => {
    if (!props.withMenu) {
      return null;
    }

    const menuItems = [
      {
        title: 'Boards',
        path: '/',
        icon: <TbCards />,
      },
      {
        title: 'Templates',
        path: '/templates',
        icon: <LuBookTemplate />,
      },
      {
        title: 'Members',
        path: '/members',
        icon: <HiOutlineUserGroup />,
      },
    ];

    const menuList = _.map(menuItems, (menuItem) => {
      const { path, title, icon } = menuItem;
      const classes = classNames(s.menuItem, {
        [s.menuItemActive]: path === '/' ? path === pathname : _.includes(pathname, path),
      });

      return (
        <Link key={path} to={path} className={classes}>
          {icon}
          <span>{title}</span>
        </Link>
      );
    });

    return (
      <div className={s.menu}>
        {menuList}
      </div>
    );
  };

  const LogoCmp = theme === 'dark' ? LogoDark : LogoLight;

  return (
    <div className={s.header}>
      <div className={s.headerContent}>
        <LogoCmp className={s.logo} onClick={() => navigate('/')} />
        {renderMenu()}
        <div className={s.headerControls}>
          <ThemeSwitch />
          {props.buttons}
        </div>
      </div>
    </div>
  );
};

export default Header;