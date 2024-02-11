import React, { useEffect, useState } from 'react';
import Toggle from 'ui/Toggle/Toggle';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useDarkMode } from 'usehooks-ts';
import { getFromLs, setToLs } from 'utils/localStorage';
import _ from 'lodash';

import s from './ThemeSwitch.module.css';

interface Props {

}

const ThemeSwitch: React.FC<Props> = () => {
  const { isDarkMode } = useDarkMode();
  const [darkTheme, setDarkTheme] = useState(getFromLs('darkTheme') ?? isDarkMode);

  useEffect(() => {
    const lsTheme = getFromLs('darkTheme');
    if (_.isNil(lsTheme)) {
      setToLs('darkTheme', isDarkMode);
    }
  }, []);

  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkTheme]);

  const handleThemeChange = (value: boolean) => {
    setDarkTheme(value);
    setToLs('darkTheme', value);
  };

  return (
    <div>
      <Toggle
        checked={darkTheme}
        onChange={handleThemeChange}
        label={darkTheme ? <MdDarkMode className={s.icon} /> : <MdLightMode className={s.icon} />}
      />
    </div>
  );
};

export default ThemeSwitch;