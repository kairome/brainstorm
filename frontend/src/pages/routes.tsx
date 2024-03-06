import RegisterPage from 'pages/Register/RegisterPage';
import LoginPage from 'pages/Login/LoginPage';
import BoardsPage from 'pages/Boards/BoardsPage';
import Board from 'pages/Board/Board';
import TemplatesPage from 'pages/Templates/TemplatesPage';
import MembersPages from 'pages/Members/MembersPages';
import NotFound from 'ui/NotFound/NotFound';
import PublicBoard from 'pages/PublicBoard/PublicBoard';
import Template from 'pages/Template/Template';

import Main from './Main';

export default [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/public-access/board/:id',
    element: <PublicBoard />,
  },
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/boards/:id',
        element: <Board />,
      },
      {
        path: '/templates/:id',
        element: <Template />,
      },
      {
        path: '/templates',
        element: <TemplatesPage />,
      },
      {
        path: '/members',
        element: <MembersPages />,
      },
      {
        path: '/',
        element: <BoardsPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];