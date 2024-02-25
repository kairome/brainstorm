import RegisterPage from 'pages/Register/RegisterPage';
import LoginPage from 'pages/Login/LoginPage';
import BoardsPage from 'pages/Boards/BoardsPage';
import Board from 'pages/Board/Board';
import TemplatesPage from 'pages/Templates/TemplatesPage';
import MembersPages from 'pages/Members/MembersPages';
import NotFound from 'ui/NotFound/NotFound';

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
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/boards/:id',
        element: <Board />,
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