import { RawData, WebSocket, WebSocketServer } from 'ws';
import { WsBoard, WsClient } from '@/types/entities';
import { WsUser } from '@/types/user';
import db from '@/db';
import _ from 'lodash';

const chatWs = new WebSocketServer({ noServer: true });

const chatRecords = new Map<string, Set<WsClient>>();

const handleCloseConnection = (socket: WsClient, boardId: string) => {
  const record = chatRecords.get(boardId);
  if (!record) {
    return;
  }

  record.delete(socket);
  if (_.isEmpty(record)) {
    chatRecords.delete(boardId);
  }
};

const handleMessage = async (socket: WsClient, data: RawData, user: WsUser, boardId: string) => {
  try {
    const parsedData = JSON.parse(data.toString());
    const message = {
      text: parsedData.text,
      date: new Date().toISOString(),
      user: {
        name: user.name,
        id: user.id,
        isAnon: user.isAnonymous,
      },
    };

    const messageStr = JSON.stringify(message);
    const clients = chatRecords.get(boardId);
    if (clients) {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
    await db.boardsCrud.saveChatMessage(boardId, message);

  } catch (e) {
    console.error('Error parsing message: ', e);
  }
};

const pingInterval = setInterval(() => {
  const clients = chatWs.clients as Set<WsClient>;
  clients.forEach((client) => {
    if (!client.isAlive) {
      return client.terminate();
    }

    client.isAlive = false;
    client.ping();
  });
}, 30000);

chatWs.on('connection', (socket: WsClient, board: WsBoard, user: WsUser) => {
  const boardId = String(board._id);

  const boardRecord = chatRecords.get(boardId);

  if (!boardRecord) {
    const clients = new Set<WsClient>();
    clients.add(socket);
    chatRecords.set(boardId, clients);
  } else {
    boardRecord.add(socket);
  }

  socket.on('close', () => handleCloseConnection(socket, boardId));
  socket.on('message', (data) => handleMessage(socket, data, user, boardId));

  socket.isAlive = true;

  socket.on('pong', () => {
    socket.isAlive = true;
  });
});

chatWs.on('close', () => {
  clearInterval(pingInterval);
});

export default chatWs;