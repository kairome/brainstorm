import useWebSocket, { ReadyState as WsReadyState } from 'react-use-websocket';
import { getFromLs } from 'utils/localStorage';
import { BoardChatMessage } from 'types/boards';

const url = `${import.meta.env.VITE_WS_URL}/chat`;

const useWsChat = (boardId: string) => {
  const socket = useWebSocket(`${url}/${boardId}`, {
    retryOnError: true,
    share: true,
    shouldReconnect: () => true,
    onError: () => {
      console.error('Error connecting');
    },
    queryParams: {
      token: getFromLs('token'),
    },
  });

  return {
    ready: socket.readyState === WsReadyState.OPEN,
    sendMessage: socket.sendJsonMessage,
    lastMessage: socket.lastJsonMessage as BoardChatMessage,
  };
};

export default useWsChat;