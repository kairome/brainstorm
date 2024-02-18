import React, { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { TooltipNotificationState } from 'types/alert';

import s from './TooltipNotification.module.css';

interface Props {
  id: string,
  notification: TooltipNotificationState | null,
  delay?: number,
  onClose: () => void,
}

const TooltipNotification: React.FC<Props> = (props) => {
  const { notification, delay } = props;

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        props.onClose();
      }, delay ?? 3000);
    }
  }, [notification]);

  if (!notification) {
    return null;
  }

  return (
    <Tooltip
      id={props.id}
      content={notification?.message}
      variant={notification?.variant}
      isOpen
      className={s.tooltip}
      noArrow
    />
  );
};

export default TooltipNotification;