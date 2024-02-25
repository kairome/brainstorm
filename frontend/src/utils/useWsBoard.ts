import useWebSocket, { ReadyState as WsReadyState } from 'react-use-websocket';
import { useEffect, useState } from 'react';
import {
  computed, createPresenceStateDerivation,
  createTLStore,
  defaultShapeUtils,
  getUserPreferences,
  HistoryEntry,
  StoreListener,
  throttle,
  TLRecord,
  react,
  defaultUserPreferences,
  InstancePresenceRecordType,
} from '@tldraw/tldraw';
import { getFromLs } from 'utils/localStorage';
import _ from 'lodash';

const url = `${import.meta.env.VITE_WS_URL}/board`;

const useWsBoard = (boardId: string) => {
  const { readyState, lastJsonMessage, sendJsonMessage } = useWebSocket(`${url}/${boardId}`, {
    share: true,
    retryOnError: true,
    shouldReconnect: () => true,
    onError: (err) => {
      console.error('Error connecting to board: ', err);
    },
    queryParams: {
      token: getFromLs('token'),
    },
  });

  const [store] = useState(() => {
    return createTLStore({
      shapeUtils: [...defaultShapeUtils],
    });
  });

  // adapted from https://github.com/tldraw/tldraw-sockets-example
  useEffect(() => {
    if (readyState !== WsReadyState.OPEN) {
      return;
    }

    const pendingChanges: HistoryEntry<TLRecord>[] = [];

    const sendChanges = throttle(() => {
      if (pendingChanges.length === 0) {
        return;
      }

      sendJsonMessage({
        type: 'update',
        updates: pendingChanges,
      });
      pendingChanges.splice(0, pendingChanges.length);
    }, 32);

    const handleChange: StoreListener<TLRecord> = (event) => {
      if (event.source !== 'user') {
        return;
      }

      pendingChanges.push(event);
      sendChanges();
    };

    const unsubs: (() => void)[] = [];

    const user = getUserPreferences();
    // turn user preference to Signal
    const computedUserPreference = computed('userPreference', () => {
      return {
        id: user.id,
        name: user.name as string,
        color: user.color ?? defaultUserPreferences.color,
      };
    });

    // create presence id with the user id, instead of a random one
    const presenceId = InstancePresenceRecordType.createId(user.id);
    // derive presence state
    const presenceState = createPresenceStateDerivation(computedUserPreference, presenceId)(store);

    unsubs.push(react('presence', () => {
      const presence = presenceState.get();
      if (!presence) {
        return;
      }

      store.put([presence]);
    }));

    unsubs.push(
      store.listen(handleChange, {
        source: 'user',
        scope: 'document',
      }),
    );

    unsubs.push(
      store.listen(handleChange, {
        source: 'user',
        scope: 'presence',
      }),
    );

    return () => {
      unsubs.forEach(fn => fn());
      unsubs.splice(0, unsubs.length);
      pendingChanges.splice(0, pendingChanges.length);
    };

  }, [store, readyState]);

  useEffect(() => {
    if (!lastJsonMessage) {
      return;
    }

    try {
      const data = lastJsonMessage as any;

      switch (data.type) {
        case 'init':
        case 'recovery': {
          store.loadSnapshot(data.snapshot);
          break;
        }
        case 'update': {
          try {
            _.forEach(data.updates, (update: HistoryEntry<TLRecord>) => {
              const { added, updated, removed } = update.changes;
              store.mergeRemoteChanges(() => {
                _.forEach(added, (value) => {
                  store.put([value]);
                });

                _.forEach(updated, (value) => {
                  store.put([value[1]]); // second element is the final update
                });

                _.forEach(removed, (value) => {
                  store.remove([value.id]);
                });
              });
            });
          } catch (e) {
            console.error(e);
            sendJsonMessage({
              type: 'recovery',
            });
          }
          break;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [lastJsonMessage]);

  return store;
};

export default useWsBoard;