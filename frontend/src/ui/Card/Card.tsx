import React, { useRef } from 'react';
import classNames from 'classnames';

import s from './Card.module.css';

interface Props {
  title?: React.ReactNode,
  children: React.ReactNode,
  className?: string,
  onClick?: () => void,
}

const Card: React.FC<Props> = (props) => {
  const { className, title, children } = props;
  const classes = classNames(s.card, className);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!props.onClick) {
      return;
    }

    if (!cardRef.current) {
      props.onClick();
      return;
    }

    if (cardRef.current.contains(e.target as Node)) {
      props.onClick();
    }
  };

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
    <div className={classes} onClick={handleClick} ref={cardRef}>
      {renderTitle()}
      {children}
    </div>
  );
};

export default Card;