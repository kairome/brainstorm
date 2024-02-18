import React from 'react';
import classNames from 'classnames';
import Loader from 'ui/Loader/Loader';

import s from './Button.module.css';

interface Props {
  children: React.ReactNode,
  type?: 'button' | 'submit',
  theme?: 'primary' | 'outline' | 'underline',
  size?: 'sm',
  onClick?: () => void,
  className?: string,
  fullWidth?: boolean,
  loading?: boolean,
  disabled?: boolean,
}

const Button: React.FC<Props> = (props) => {
  const {
    type = 'button',
    className,
    theme = 'primary',
    children,
    fullWidth,
    loading,
    disabled,
    size,
  } = props;

  const btnClasses = classNames(s.button, className, {
    [s.buttonPrimary]: theme === 'primary',
    [s.buttonUnderline]: theme === 'underline',
    [s.buttonFullWidth]: fullWidth,
    [s.btnSm]: size === 'sm',
  });

  return (
    <button
      className={btnClasses}
      type={type}
      onClick={props.onClick}
      disabled={loading || disabled}
    >
      {loading ? (<Loader size="xs" className={s.btnLoader} />) : null}
      {children}
    </button>
  );
};

export default Button;