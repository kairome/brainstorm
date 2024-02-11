import React from 'react';
import classNames from 'classnames';

import s from './Toggle.module.css';

interface Props {
  label?: React.ReactNode,
  checked: boolean,
  onChange: (v: boolean) => void,
}

const Toggle: React.FC<Props> = (props) => {
  const { checked, label } = props;

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    props.onChange(e.currentTarget.checked);
  };

  const switchClasses = classNames(s.switch, {
    [s.checked]: checked,
  });

  return (
    <label className={s.toggleWrapper}>
      <input
        type="checkbox"
        onChange={handleChange}
        checked={checked}
        value={String(checked)}
      />
      <span className={switchClasses} />
      {label}
    </label>
  );
};

export default Toggle;