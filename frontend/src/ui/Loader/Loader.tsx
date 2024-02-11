import React from 'react';
import classNames from 'classnames';

import s from './Loader.module.css';

interface Props {
  size?: 'lg' | 'sm' | 'xs',
  className?: string,
}

const Loader: React.FC<Props> = (props) => {
  const { size = 'lg' } = props;
  const classes = classNames(s.loader, props.className, {
    [s.lg]: size === 'lg',
    [s.sm]: size === 'sm',
    [s.xs]: size === 'xs',
  });
  return (
    <div className={classes} />
  );
};

export default Loader;