import React from 'react';
import classNames from 'classnames';

import s from './Toggle.module.css';

interface Props {
  label?: React.ReactNode,
  checked: boolean,
  onChange: (v: boolean) => void,
  className?: string,
  disabled?: boolean,
}

const Toggle: React.FC<Props> = (props) => {
  const { checked, label, disabled } = props;

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    props.onChange(e.currentTarget.checked);
  };

  const switchClasses = classNames(s.switch, {
    [s.checked]: checked,
  });

  const wrapperClassNames = classNames(s.toggleWrapper, props.className, {
    [s.disabled]: disabled,
  });

  return (
    <label className={wrapperClassNames}>
      {label}
      <input
        type="checkbox"
        onChange={handleChange}
        checked={checked}
        value={String(checked)}
        disabled={disabled}
      />
      <span className={switchClasses} />
    </label>
  );
};

export default Toggle;