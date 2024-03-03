import React from 'react';
import classNames from 'classnames';
import Loader from 'ui/Loader/Loader';

import s from './Button.module.css';

interface Props {
  children: React.ReactNode,
  type?: 'button' | 'submit',
  theme?: 'primary' | 'danger',
  appearance?: 'default' | 'outline' | 'underline',
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
    appearance = 'default',
    ...rest
  } = props;

  const isUnderline = appearance === 'underline';
  const btnClasses = classNames(s.button, className, {
    [s.buttonPrimary]: theme === 'primary',
    [s.buttonDanger]: theme === 'danger',
    [s.buttonUnderline]: isUnderline,
    [s.buttonFullWidth]: fullWidth,
    [s.btnSm]: size === 'sm',
  });

  return (
    <button
      {...rest}
      className={btnClasses}
      type={type}
      onClick={props.onClick}
      disabled={loading || disabled}
    >
      {loading ? (<Loader size={isUnderline ? 'xss' : 'xs'} className={s.btnLoader} />) : null}
      {children}
    </button>
  );
};

export default Button;