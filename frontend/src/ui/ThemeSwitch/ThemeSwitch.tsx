import React, { useEffect } from 'react';
import Toggle from 'ui/Toggle/Toggle';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useDarkMode } from 'usehooks-ts';

import s from './ThemeSwitch.module.css';
import { useRecoilState } from 'recoil';
import { themeState } from 'store/theme.ts';

interface Props {

}

const ThemeSwitch: React.FC<Props> = () => {
  const { isDarkMode } = useDarkMode();
  const [theme, setTheme] = useRecoilState(themeState);

  useEffect(() => {
    if (!theme) {
      setTheme(isDarkMode ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeChange = (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <div>
      <Toggle
        checked={theme === 'dark'}
        onChange={handleThemeChange}
        label={theme === 'dark' ? <MdDarkMode className={s.icon} /> : <MdLightMode className={s.icon} />}
      />
    </div>
  );
};

export default ThemeSwitch;