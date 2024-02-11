import React from 'react';
import classNames from 'classnames';

import s from './Card.module.css';

interface Props {
  title?: React.ReactNode,
  children: React.ReactNode,
  className?: string,
}

const Card: React.FC<Props> = (props) => {
  const { className, title, children } = props;
  const classes = classNames(s.card, className);

  const renderTitle = () => {
    if (!title) {
      return null;
    }

    if (typeof title === 'string') {
      return (
        <h2>{title}</h2>
      );
    }

    return title;
  };

  return (
    <div className={classes}>
      {renderTitle()}
      {children}
    </div>
  );
};

export default Card;