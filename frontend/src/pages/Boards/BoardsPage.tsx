import React from 'react';
import commonS from 'css/common.module.css';
import Card from 'ui/Card/Card';
import AddBoardLogo from 'assets/addBoard.svg?react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addBoard, fetchBoards } from 'api/boards';
import { useNavigate } from 'react-router-dom';
import { useNotify } from 'store/alert';
import { getApiErrors } from 'utils/apiErrors';
import { AxiosError } from 'axios';
import _ from 'lodash';
import Loader from 'ui/Loader/Loader';
import BoardCard from 'pages/Boards/BoardCard';

import s from './Boards.module.css';

const BoardsPage: React.FC = () => {
  const navigate = useNavigate();
  const notify = useNotify();

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

  const { data: boards, isLoading: boardsLoading, refetch: loadBoards } = useQuery({
    queryKey: [fetchBoards.name],
    queryFn: fetchBoards.request,
  });

  const renderBoards = () => {
    if (boardsLoading) {
      return (
        <div className={s.loaderContainer}>
          <Loader />
        </div>
      );
    }

    const boardsList = _.map(boards, (board) => {
      return (
        <BoardCard
          key={board._id}
          board={board}
          loadBoards={loadBoards}
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
    <>
      <h1 className={commonS.pageTitle}>My boards</h1>
      {renderBoards()}
    </>
  );
};

export default BoardsPage;