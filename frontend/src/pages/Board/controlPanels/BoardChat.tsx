import React, { useEffect, useRef, useState } from 'react';
import s from 'pages/Board/Board.module.css';
import { useRecoilValue } from 'recoil';
import { userState } from 'store/user';
import { useOnClickOutside } from 'usehooks-ts';
import { IoChatboxOutline, IoSendSharp } from 'react-icons/io5';
import { BoardItem } from 'types/boards';
import useWsChat from 'utils/useWsChat';
import Loader from 'ui/Loader/Loader';
import _ from 'lodash';
import classNames from 'classnames';
import { getFormattedDate } from 'utils/dates';

interface Props {
  board: BoardItem,
}

const BoardChat: React.FC<Props> = (props) => {
  const { board } = props;
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesContainer = useRef<HTMLDivElement>(null);
  const user = useRecoilValue(userState);

  const { ready, sendMessage, lastMessage } = useWsChat(board._id);

  const [showChat, setShowChat] = useState(false);

  const [chatMessage, setChatMessage] = useState('');

  const [messages, setMessages] = useState(board.chatMessages ?? []);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const scrollToBottom = () => {
    if (messagesContainer.current) {
      console.log(' messagesContainer.current.scrollHeight -> ', messagesContainer.current.scrollHeight);
      messagesContainer.current.scroll({
        top: messagesContainer.current.scrollHeight + 70,
      });
    }
  };
  useOnClickOutside(panelRef, () => setShowChat(false));

  useEffect(() => {
    if (!_.isEmpty(lastMessage)) {
      setMessages([...messages, lastMessage]);

      if (!showChat) {
        setHasNewMessage(true);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (showChat) {
      setHasNewMessage(false);
      scrollToBottom();
    }
  }, [messages, showChat]);

  const handleChatMessageChange = (e: React.FormEvent<HTMLInputElement>) => {
    setChatMessage(e.currentTarget.value);
  };

  const handleSendMessage = () => {
    sendMessage({
      text: chatMessage,
    });
    setChatMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderChatContent = () => {
    if (!ready) {
      return (
        <Loader size="sm" />
      );
    }

    const msgList = _.map(messages, (message) => {
      const { user: msgUser, text, date } = message;
      const isMyMessage = msgUser.id === user?._id;

      const chatMessageClasses = classNames(s.chatMessage, {
        [s.myMessage]: isMyMessage,
      });

      const messageBubbleClasses = classNames(s.messageBubble, {
        [s.myBubble]: isMyMessage,
      });
      return (
        <div key={`${msgUser.id}-${date}`} className={chatMessageClasses}>
          <div>{isMyMessage ? 'Me' : msgUser.name}, {getFormattedDate(date)}</div>
          <div className={messageBubbleClasses}>{text}</div>
        </div>
      );
    });

    return (
      <>
        <div className={s.chatMessages} ref={messagesContainer}>
          {_.isEmpty(msgList) ? 'There are no messages yet' : msgList}
        </div>
        <div className={s.chatInputWrapper}>
          <input
            type="text"
            value={chatMessage}
            placeholder="Enter your message"
            onChange={handleChatMessageChange}
            className={s.chatInput}
            onKeyDown={handleKeyDown}
          />
          <IoSendSharp onClick={handleSendMessage} />
        </div>
      </>
    );
  };

  const renderChatPanel = () => {
    if (!showChat) {
      return null;
    }

    return (
      <div className={s.panelChat}>
        {renderChatContent()}
      </div>
    );
  };

  return (
    <div className={s.panelContainer} ref={panelRef}>
      <div className={s.controlPanelTrigger} onClick={() => setShowChat(!showChat)}>
        <IoChatboxOutline size={30} />
        {hasNewMessage ? (<div className={s.newMessage} />) : null}
      </div>
      {renderChatPanel()}
    </div>
  );
};

export default BoardChat;