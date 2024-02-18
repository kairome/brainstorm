import { atom } from 'recoil';
import { getFromLs, setToLs } from 'utils/localStorage';

export const themeState = atom({
  key: 'theme',
  default: getFromLs('theme'),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        setToLs('theme', newValue);
      });
    },
  ],
});
