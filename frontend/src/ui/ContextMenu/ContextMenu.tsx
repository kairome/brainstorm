import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import _ from 'lodash';

import s from './ContextMenu.module.css';

interface Action {
  title: string,
  onClick: () => void,
  icon: React.ReactNode,
}

interface Props extends React.PropsWithChildren {
  id: string,
  actions: Action[],
}

const ContextMenu: React.FC<Props> = (props) => {
  const [showActions, setShowActions] = useState(false);

  const handleInternalToggle = (shouldOpen: boolean) => {
    if (!shouldOpen && showActions) {
      setShowActions(false);
    }
  };

  const renderActions = () => {
    return _.map(props.actions, (action) => {
      const handleClick = () => {
        setShowActions(false);
        action.onClick();
      };

      return (
        <div key={action.title} onClick={handleClick} className={s.action}>
          {action.icon} {action.title}
        </div>
      );
    });
  };

  return (
    <>
      <div data-tooltip-id={props.id}>
        <div
          onClick={() => setShowActions(!showActions)}
          className={s.trigger}
        >
          {props.children}
        </div>
      </div>
      <Tooltip
        id={props.id}
        place="bottom"
        className={s.tooltip}
        isOpen={showActions}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        setIsOpen={handleInternalToggle}
        openOnClick
        offset={25}
        clickable
      >
        <div className={s.actionsContainer}>
          {renderActions()}
        </div>
      </Tooltip>
    </>
  );
};

export default ContextMenu;