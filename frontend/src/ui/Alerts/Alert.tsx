import { AlertStateItem } from 'types/alert';
import { useCloseAlert } from 'store/alert';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import s from './Alerts.module.css';

interface Props {
  alert: AlertStateItem,
}

const Alert: React.FC<Props> = (props) => {
  const { alert } = props;
  const timeout = useRef<number>();
  const closeAlert = useCloseAlert();

  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    if (alert.timeout === 0) {
      return;
    }

    timeout.current = window.setTimeout(() => {
      setLeaving(true);
    }, alert.timeout ? alert.timeout * 1000 : 3000);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [alert]);

  useEffect(() => {
    setTimeout(() => {
      setEntered(true);
    }, 10);
  }, []);

  useEffect(() => {
    if (leaving) {
      setEntered(false);
      setTimeout(() => {
        closeAlert(alert.id);
      }, 300);
    }
  }, [leaving]);

  const handleClose = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    setLeaving(true);
  };

  const themeClass = classNames({
    [s.alertSuccess]: alert.type === 'success',
    [s.alertInfo]: alert.type === 'info',
    [s.alertError]: alert.type === 'error',
  });

  const alertClasses = classNames(s.alert, {
    [s.entered]: entered,
  });
  return (
    <div className={alertClasses} key={alert.id} onClick={handleClose}>
      <div className={s.alertContent}>{alert.message}</div>
      <div className={themeClass} />
    </div>
  );
};

export default Alert;