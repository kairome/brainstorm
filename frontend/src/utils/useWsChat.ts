import useWebSocket, { ReadyState as WsReadyState } from 'react-use-websocket';
import { useEffect } from 'react';

const url = `${import.meta.env.VITE_WS_URL}/chat`;

const useWsChat = () => {
  const socket = useWebSocket(url, {
    retryOnError: true,
    share: true,
    shouldReconnect: () => true,
    onError: () => {
      console.error('Error connecting');
    },
  });

  useEffect(() => {
    if (socket.readyState === WsReadyState.OPEN) {
      socket.sendJsonMessage({
        msg: 'Hello from frontend',
      });
    }
  }, [socket.readyState]);

  return {
    sendMessage: socket.sendMessage,
    lastMessage: socket.lastJsonMessage,
  };
};

export default useWsChat;