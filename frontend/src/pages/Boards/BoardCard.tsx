import React, { useEffect } from 'react';
import Card from 'ui/Card/Card';
import s from 'pages/Boards/Boards.module.css';
import { Board } from 'types/boards';
import DefaultThumbnail from 'assets/defaultThumbnail.svg?react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBoardThumbnail } from 'api/boards';
import Loader from 'ui/Loader/Loader';
import { IoIosStarOutline, IoIosStar } from 'react-icons/io';
import { IoEllipsisVertical, IoShareSocial, IoTrashOutline, IoSaveOutline, IoPersonAdd } from 'react-icons/io5';
import contextMenuS from 'ui/ContextMenu/ContextMenu.module.css';
import classNames from 'classnames';
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import { Tooltip } from 'react-tooltip';
import { DateTime } from 'luxon';

interface Props {
  board: Board,
}

const BoardCard: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const { board } = props;

  const { data: thumbnail, isLoading, refetch: loadThumbnail } = useQuery({
    queryKey: [fetchBoardThumbnail.name, board._id],
    queryFn: () => fetchBoardThumbnail.request(board._id),
    enabled: false,
  });

  useEffect(() => {
    if (board.customThumbnail) {
      loadThumbnail();
    }
  }, [board.customThumbnail]);

  const handleSetFavorite = () => {
    const nextFav = !board.isFavorite;
    console.log('set to fav ', nextFav);
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
          onClick={() => navigate(`/boards/${board._id}`)}
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

  const boardActions = [
    {
      title: 'Share',
      icon: <IoShareSocial />,
      onClick: () => {
        console.log('share');
      },
    },
    {
      title: 'Invite to board',
      icon: <IoPersonAdd />,
      onClick: () => {
        console.log('invite');
      },
    },
    {
      title: 'Save as template',
      icon: <IoSaveOutline />,
      onClick: () => {
        console.log('save as template');
      },
    },
    {
      title: 'Delete',
      icon: <IoTrashOutline />,
      className: s.removeAction,
      onClick: () => {
        console.log('deleting');
      },
    },
  ];

  const updatedAt = DateTime.fromISO(board.updatedAt);
  const dateCutOff = DateTime.now().minus({ day: 1 });
  const updatedDate = dateCutOff < updatedAt ?
    DateTime.now().plus(updatedAt.diffNow()).toRelative() :
    updatedAt.toFormat('dd.MM.yyyy HH:mm');

  return (
    <Card
      className={s.boardCard}
    >
      <div className={s.boardContent}>
        <div className={s.boardHeader}>
          <h2
            data-tooltip-id={`${board._id}-title`}
            onClick={() => navigate(`/boards/${board._id}`)}
          >
            {board.title}
          </h2>
          <Tooltip
            id={`${board._id}-title`}
            content={board.title}
            place="bottom-start"
            noArrow
          />
          <div className={s.boardHeaderControls}>
            {renderFavIcon()}
            <ContextMenu
              id={`board${board._id}-cardActions`}
              actions={boardActions}
              place="bottom-end"
            >
              <IoEllipsisVertical
                className={s.boardActionsIcon}
              />
            </ContextMenu>
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