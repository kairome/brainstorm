import React, { useState } from 'react';
import { PlacesType, Tooltip } from 'react-tooltip';
import _ from 'lodash';
import classNames from 'classnames';

import s from './ContextMenu.module.css';

interface Action {
  title: string,
  onClick: () => void,
  icon: React.ReactNode,
  forbidden?: boolean,
  className?: string,
}

interface Props extends React.PropsWithChildren {
  id: string,
  actions: Action[],
  place?: PlacesType,
  offset?: number,
}

const ContextMenu: React.FC<Props> = (props) => {
  const {
    place = 'bottom',
    offset,
  } = props;
  const [showActions, setShowActions] = useState(false);

  const handleInternalToggle = (shouldOpen: boolean) => {
    if (!shouldOpen && showActions) {
      setShowActions(false);
    }
  };

  const renderActions = () => {
    return _.map(props.actions, (action) => {
      if (action.forbidden) {
        return null;
      }

      const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setShowActions(false);
        action.onClick();
      };

      return (
        <div
          key={action.title}
          onClick={handleClick}
          className={classNames(s.action, action.className)}
        >
          {action.icon} {action.title}
        </div>
      );
    });
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowActions(!showActions);
  };

  return (
    <>
      <div
        onClick={handleTriggerClick}
        className={s.trigger}
        data-tooltip-id={props.id}
      >
        {props.children}
      </div>
      <Tooltip
        id={props.id}
        place={place}
        className={s.tooltip}
        isOpen={showActions}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        setIsOpen={handleInternalToggle}
        offset={offset}
        clickable
        openOnClick
        delayHide={1}
      >
        <div className={s.actionsContainer}>
          {renderActions()}
        </div>
      </Tooltip>
    </>
  );
};

export default ContextMenu;