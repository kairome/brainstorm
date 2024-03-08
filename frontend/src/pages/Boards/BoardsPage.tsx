import React, { useEffect, useMemo, useState } from 'react';
import commonS from 'css/common.module.css';
import Card from 'ui/Card/Card';
import AddBoardLogo from 'assets/addBoard.svg?react';
import { useMutation } from '@tanstack/react-query';
import { addBoard, fetchBoards } from 'api/boards';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotify } from 'store/alert';
import { getApiErrors } from 'utils/apiErrors';
import { AxiosError } from 'axios';
import _ from 'lodash';
import BoardCard from 'pages/Boards/BoardCard';
import { BoardItem } from 'types/boards';
import ContentLoader from 'ui/Loader/ContentLoader';
import queryString from 'query-string';

import s from './Boards.module.css';
import BoardFilters from './BoardFilters';

const BoardsPage: React.FC = () => {
  const navigate = useNavigate();
  const notify = useNotify();

  const [boards, setBoards] = useState<BoardItem[]>([]);

  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  const filters = useMemo(() => queryString.parse(search), [search]);

  const { mutate: addBoardRequest, isPending } = useMutation({
    mutationFn: addBoard.request,
    onSuccess: (boardId) => {
      navigate(`/boards/${boardId}`);
    },
    onError: (err: AxiosError) => {
      const errMsg = getApiErrors(err);
      notify({ type: 'error', message: _.isString(errMsg) ? errMsg : 'Failed to create the board' });
    },
  });

  const { isPending: boardsLoading, mutate: loadBoards } = useMutation({
    mutationFn: fetchBoards.request,
    onSuccess: setBoards,
  });

  useEffect(() => {
    if (!isPending) {
      loadBoards(filters);
    }
  }, [filters]);

  const toggleFav = (boardId: string) => {
    if (filters.isFavorite) {
      loadBoards(filters);
      return;
    }

    const newBoards = _.map(boards, (b) => {
      return {
        ...b,
        isFavorite: boardId === b._id ? !b.isFavorite : b.isFavorite,
      };
    });
    setBoards(newBoards);
  };

  const renderBoards = () => {
    const boardsList = _.map(boards, (board) => {
      return (
        <BoardCard
          key={board._id}
          board={board}
          toggleFavorite={toggleFav}
          loadBoards={() => loadBoards(filters)}
        />
      );
    });

    return (
      <div className={s.boards}>
        <Card className={s.newBoardCard} title="New board" onClick={handleAddBoard}>
          <AddBoardLogo />
        </Card>
        {boardsList}
      </div>
    );
  };

  const handleAddBoard = () => {
    if (isPending) {
      return;
    }

    addBoardRequest();
  };

  return (
    <ContentLoader loading={boardsLoading}>
      <h1 className={commonS.pageTitle}>My boards</h1>
      <BoardFilters />
      {renderBoards()}
    </ContentLoader>
  );
};

export default BoardsPage;