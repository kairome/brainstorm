import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { SECRET_KEY, WS_PORT } from '@/config';
import jwt from 'jsonwebtoken';

import _ from 'lodash';
import boardWs from '@/websockets/boards';
import * as querystring from 'querystring';
import db from '@/db';
import { v4 } from 'uuid';

const server = createServer();

const chatWs = new WebSocketServer({ noServer: true });

chatWs.on('connection', (socket, request) => {
  socket.on('error', console.error);
  console.info('client connected');

  socket.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('received data -> ', message);
    socket.send(JSON.stringify({ message: 'hello from chat websockets' }));
  });
});

const getUserFromToken = async (token?: string) => {
  const anonUser = {
    id: v4(),
    name: 'Anonymous',
    email: null,
    isAnonymous: true,
  };

  if (!token) {
    return anonUser;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    const user = await db.userCrud.getUserById(decoded.userId);
    if (!user) {
      return anonUser;
    }

    return {
      ...user,
      id: String(user._id),
      name: user.name,
      email: user.email,
      isAnonymous: false,
    };
  } catch (e) {
    return anonUser;
  }
};

server.on('upgrade', async (request, socket, head) => {
  const { url } = request;

  if (!url) {
    socket.destroy();
    return;
  }

  const [path, queryParams] = url.split('?');
  const query = querystring.parse(queryParams);
  const user = await getUserFromToken(query.token as string | undefined);

  if (path === '/chat') {
    if (user.isAnonymous) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    chatWs.handleUpgrade(request, socket, head, (ws) => {
      chatWs.emit('connection', ws, request);
    });
  } else if (_.includes(path, '/board')) {
    const [, boardId] = path.split('/board/');

    const board = await db.boardsCrud.getOneById(boardId);

    if (!board) {
      socket.destroy();
      return;
    }

    if (user.isAnonymous && query.anonUserId) {
      user.id = query.anonUserId as string;
    }

    boardWs.handleUpgrade(request, socket, head, (ws) => {
      boardWs.emit('connection', ws, { ...board, isPublic: query.isPublic === 'true' }, user);
    });
  } else {
    socket.destroy();
  }
});

server.listen(WS_PORT, () => {
  console.info(`[WS] started on ${WS_PORT}`);
});