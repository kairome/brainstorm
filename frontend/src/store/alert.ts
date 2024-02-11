import { AlertPayload, AlertStateItem } from 'types/alert';
import { atom, useSetRecoilState } from 'recoil';
import { v4 } from 'uuid';
import _ from 'lodash';

export const alertsState = atom<AlertStateItem[]>({
  key: 'alerts',
  default: [],
});

export const useNotify = () => {
  const set = useSetRecoilState(alertsState);
  return (payload: AlertPayload) => {
    const newAlert = {
      ...payload,
      id: v4(),
    };
    set(oldState => ([...oldState, newAlert]));
  };
};

export const useCloseAlert = () => {
  const set = useSetRecoilState(alertsState);

  return (id: string) => {
    set(oldState => _.filter(oldState, a => a.id !== id));
  };
};