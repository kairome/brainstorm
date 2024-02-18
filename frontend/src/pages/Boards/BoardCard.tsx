import React, { useEffect } from 'react';
import Card from 'ui/Card/Card';
import s from 'pages/Boards/Boards.module.css';
import { Board } from 'types/boards';
import DefaultThumbnail from 'assets/defaultThumbnail.svg?react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBoardThumbnail } from 'api/boards';
import Loader from 'ui/Loader/Loader';

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

  const renderThumbnail = () => {
    if (isLoading) {
      return (
        <div className={s.boardLoader}>
          <Loader />
        </div>
      );
    }

    return thumbnail && board.customThumbnail ? <img src={thumbnail} className={s.thumbnail} /> :
      <DefaultThumbnail className={s.thumbnail} />;
  };

  return (
    <Card
      onClick={() => navigate(`/boards/${board._id}`)}
      className={s.boardCard}
    >
      <div className={s.boardContent}>
        <div className={s.boardHeader}>
          <h2>{board.title}</h2>
        </div>
      </div>
      {renderThumbnail()}
    </Card>
  );
};

export default BoardCard;