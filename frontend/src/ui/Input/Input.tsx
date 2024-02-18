import React from 'react';
import classNames from 'classnames';

import s from './Input.module.css';

interface Props {
  label: string,
  value: string,
  type: 'text' | 'password' | 'number' | 'email',
  placeholder?: string,
  onChange: (v: string) => void,
  className?: string,
  required?: boolean,
  disabled?: boolean,
  error?: string,
  icon?: React.ReactNode,
  iconPosition?: 'left' | 'right',
  autoComplete?: string,
  onBlur?: () => void,
}

const Input: React.FC<Props> = (props) => {
  const {
    className,
    label,
    onChange,
    error,
    icon,
    iconPosition = 'right',
    ...rest
  } = props;
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value);
  };

  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    const iconClasses = classNames(s.inputIcon, {
      [s.inputIconLeft]: iconPosition === 'left',
      [s.inputIconRight]: iconPosition === 'right',
    });
    return (
      <div className={iconClasses}>
        {icon}
      </div>
    );
  };

  const inputClasses = classNames(s.input, className, {
    [s.inputError]: Boolean(error),
    [s.inputWithIconLeft]: icon && iconPosition === 'left',
    [s.inputWithIconRight]: icon && iconPosition === 'right',
  });

  return (
    <div className={s.inputWrapper}>
      <label className={s.inputLabel}>{label}</label>
      {iconPosition === 'left' ? renderIcon() : null}
      <input {...rest} onChange={handleChange} className={inputClasses} />
      {iconPosition === 'right' ? renderIcon() : null}
      {error ? <div className={s.error}>{error}</div> : null}
    </div>
  );
};

export default Input;