import { alertsState } from 'store/alert';
import { useRecoilValue } from 'recoil';
import React from 'react';
import _ from 'lodash';

import Alert from './Alert';
import s from './Alerts.module.css';

const Alerts: React.FC = () => {
  const alerts = useRecoilValue(alertsState);

  const renderAlerts = () => {
    return _.map(alerts, (alert) => {
      return (
        <Alert alert={alert} key={alert.id} />
      );
    });
  };

  return (
    <div className={s.alertsContainer}>
      {renderAlerts()}
    </div>
  );
};

export default Alerts;