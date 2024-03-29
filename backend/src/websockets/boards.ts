import { RawData, WebSocket, WebSocketServer } from 'ws';
import _ from 'lodash';
import db from '@/db';
import { BoardDoc } from '@/types/boards';
import { WsUser } from '@/types/user';
import { WsBoard, WsClient } from '@/types/entities';

interface BoardRecord {
  clients: Set<WebSocket>,
  snapshot: BoardDoc['snapshot'],
  updateInterval: NodeJS.Timeout,
  presences: Map<string, any>,
}

interface BoardUpdate {
  source: string,
  changes: {
    added: Record<string, any>,
    removed: Record<string, any>,
    updated: Record<string, any>,
  },
}

const boardRecords = new Map<string, BoardRecord>();

const boardWs = new WebSocketServer({ noServer: true });

const broadcastToBoardClients = (clients: BoardRecord['clients'], socket: WebSocket, message: string) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== socket) {
      client.send(message);
    }
  });
};

export const handleCloseConnection = async (socket: WebSocket, boardId: string, user: WsUser) => {
  const record = boardRecords.get(boardId);
  if (!record) {
    return;
  }

  record.clients.delete(socket);

  if (_.isEmpty(record.clients)) {
    clearInterval(record.updateInterval);
    await db.boardsCrud.updateSnapshot(boardId, record.snapshot, user.name);
    boardRecords.delete(boardId);
    return;
  }

  const presenceId = `instance_presence:${user.id}`;
  const presence = record.presences.get(presenceId);

  // remove user presence for other clients
  broadcastToBoardClients(record.clients, socket, JSON.stringify({
    type: 'update',
    updates: [
      {
        changes: {
          added: {},
          updated: {},
          removed: {
            [presenceId]: presence,
          },
        },
        source: 'user',
      },
    ],
  }));
};

const sendRecovery = (socket: WebSocket, snapshot: object) => {
  socket.send(JSON.stringify({
    type: 'recovery',
    snapshot,
  }));
};

const getUserCanEditBoard = (user: WsUser, board: WsBoard) => {
  if (board.isPublic) {
    const { anonUsers, registeredUsers } = board.publicPermissions;

    return (user.isAnonymous && anonUsers.canEdit) || (!user.isAnonymous && registeredUsers.canEdit);
  }

  if (user.isAnonymous) {
    return false;
  }

  if (user.id === board.author) {
    return true;
  }

  const invited = _.find(board.invitedUsers, u => u.userId === String(user._id));

  return invited && invited.canEdit;
};

// adapted from https://github.com/tldraw/tldraw-sockets-example
const handleMessage = (socket: WebSocket, data: RawData, board: WsBoard, user: WsUser) => {
  try {
    const message = JSON.parse(data.toString());
    const boardRecord = boardRecords.get(board._id.toString());

    const canEdit = getUserCanEditBoard(user, board);

    if (!boardRecord) {
      sendRecovery(socket, board.snapshot);
      return;
    }

    switch (message.type) {
      case 'update': {
        try {
          const store = boardRecord.snapshot.store;
          const presenceAdded: Record<string, any> = {};
          const presenceUpdated: Record<string, any> = {};
          // go through all updates
          _.forEach(message.updates, (update: BoardUpdate) => {
            const { added, updated, removed } = update.changes;

            // add new shapes to the local store
            _.forEach(added, (value, key) => {
              // add presence to a separate record
              if (value.typeName !== 'instance_presence') {
                if (canEdit) {
                  store[key] = value;
                }
              } else {
                presenceAdded[key] = value;
                boardRecord.presences.set(key, value);
              }
            });

            // save updates
            _.forEach(updated, (value, key) => {
              const finalValue = value[1];
              // update presence separately
              if (finalValue.typeName !== 'instance_presence') {
                if (canEdit) {
                  store[key] = finalValue; // updates are an array of 2 elements, last one is the final update
                }
              } else {
                presenceUpdated[key] = value;
                boardRecord.presences.set(key, finalValue);
              }
            });

            // remove shape
            _.forEach(removed, (value, key) => {
              if (canEdit) {
                delete store[key];
              }
            });
          });

          const broadcastMessage = canEdit ? data.toString() : JSON.stringify({
            type: 'update',
            updates: [
              {
                changes: {
                  added: presenceAdded,
                  updated: presenceUpdated,
                  removed: {},
                },
                source: 'user',
              },
            ]
          });

          broadcastToBoardClients(boardRecord.clients, socket, broadcastMessage);
        } catch (err) {
          console.error('Error merging updates: ', err);
          sendRecovery(socket, boardRecord.snapshot);
        }
        break;
      }
      case 'recovery': {
        sendRecovery(socket, boardRecord.snapshot);
        break;
      }
      default: {
        break;
      }
    }

  } catch (err) {
    console.error('Error in parsing: ', err);
  }
};

// ping client every 30s, remove the socket if the client is stale
const pingInterval = setInterval(() => {
  const clients = boardWs.clients as Set<WsClient>;
  clients.forEach((client) => {
    if (!client.isAlive) {
      return client.terminate();
    }

    client.isAlive = false;
    client.ping();
  });
}, 30000);

boardWs.on('connection', async (socket: WsClient, board: WsBoard, user: WsUser) => {
  const boardId = String(board._id);

  socket.isAlive = true;

  socket.on('pong', () => {
    socket.isAlive = true;
  });

  const boardRecord = boardRecords.get(boardId);

  if (!boardRecord) {
    // initialize in memory record for the board
    const clientsSet = new Set<WebSocket>();
    clientsSet.add(socket);
    const interval = setInterval(async () => {
      const record = boardRecords.get(boardId);
      if (!record) {
        clearInterval(interval);
        return;
      }

      await db.boardsCrud.updateSnapshot(boardId, record.snapshot, user.name);
    }, 5000);

    boardRecords.set(boardId, {
      clients: clientsSet,
      snapshot: board.snapshot,
      updateInterval: interval,
      presences: new Map(),
    });

    socket.send(JSON.stringify({
      type: 'init',
      snapshot: board.snapshot,
    }));
  } else {
    socket.send(JSON.stringify({
      type: 'init',
      snapshot: boardRecord.snapshot,
    }));
    boardRecord.clients.add(socket);
  }

  socket.on('close', () => handleCloseConnection(socket, boardId, user));
  socket.on('message', (data) => handleMessage(socket, data, board, user));
});

boardWs.on('close', () => {
  clearInterval(pingInterval);
});

export default boardWs;