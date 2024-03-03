import React, { useEffect } from 'react';
import Card from 'ui/Card/Card';
import s from 'pages/Boards/Boards.module.css';
import { BoardItem } from 'types/boards';
import DefaultThumbnail from 'assets/defaultThumbnail.svg?react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchBoardThumbnail, setBoardFavorite } from 'api/boards';
import Loader from 'ui/Loader/Loader';
import { IoIosStarOutline, IoIosStar } from 'react-icons/io';
import contextMenuS from 'ui/ContextMenu/ContextMenu.module.css';
import classNames from 'classnames';
import { Tooltip } from 'react-tooltip';
import { DateTime } from 'luxon';
import { useRecoilValue } from 'recoil';
import { userState } from 'store/user';
import BoardCardActions from 'pages/Boards/BoardCardActions';
import { useNotify } from 'store/alert';

interface Props {
  board: BoardItem,
  toggleFavorite: (bId: string) => void,
  loadBoards: () => void,
}

const BoardCard: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const { board } = props;
  const notify = useNotify();

  const user = useRecoilValue(userState);

  const isOwner = user ? user._id === board.author : false;

  const { data: thumbnail, isLoading, refetch: loadThumbnail } = useQuery({
    queryKey: [fetchBoardThumbnail.name, board._id],
    queryFn: () => fetchBoardThumbnail.request(board._id),
    enabled: false,
  });

  const { mutate: setFavorite } = useMutation({
    mutationFn: setBoardFavorite.request,
    onSuccess: () => {
      props.toggleFavorite(board._id);
    },
    onError: () => {
      notify({
        type: 'error',
        message: 'Could not set the board to favorite',
      });
      props.toggleFavorite(board._id);
    },
  });

  useEffect(() => {
    if (board.customThumbnail) {
      loadThumbnail();
    }
  }, [board.customThumbnail]);

  const handleSetFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorite(board._id);
  };

  const renderThumbnail = () => {
    if (isLoading) {
      return (
        <div className={s.boardLoader}>
          <Loader />
        </div>
      );
    }

    if (thumbnail && board.customThumbnail) {
      return (
        <img
          src={thumbnail}
          className={s.thumbnail}
        />
      );
    }

    return (
      <DefaultThumbnail
        className={s.thumbnail}
        onClick={() => navigate(`/boards/${board._id}`)}
      />
    );
  };

  const renderFavIcon = () => {
    const Icon = board.isFavorite ? IoIosStar : IoIosStarOutline;

    const classes = classNames(s.boardFavIcon, contextMenuS.trigger, {
      [s.favorite]: board.isFavorite,
    });

    return (
      <Icon
        className={classes}
        onClick={handleSetFavorite}
      />
    );
  };

  const updatedAt = DateTime.fromISO(board.updatedAt);
  const dateCutOff = DateTime.now().minus({ day: 1 });
  const updatedDate = dateCutOff < updatedAt ?
    DateTime.now().plus(updatedAt.diffNow()).toRelative() :
    updatedAt.toFormat('dd.MM.yyyy HH:mm');

  return (
    <Card
      className={s.boardCard}
      onClick={() => navigate(`/boards/${board._id}`)}
    >
      <div className={s.boardContent}>
        <div className={s.boardHeader}>
          <h2
            data-tooltip-id={`${board._id}-title`}
          >
            {board.title}
          </h2>
          <Tooltip
            id={`${board._id}-title`}
            content={board.title}
            place="bottom-start"
            delayShow={1000}
            noArrow
          />
          <div className={s.boardHeaderControls}>
            {renderFavIcon()}
            <BoardCardActions
              board={board}
              isOwner={isOwner}
              onSuccess={props.loadBoards}
            />
          </div>
        </div>
        <div className={s.boardStatus}>
          {board.modifiedBy ? `Modified by ${board.modifiedBy}, ` : 'Modified '}
          {updatedDate}
        </div>
      </div>
      {renderThumbnail()}
    </Card>
  );
};

export default BoardCard;