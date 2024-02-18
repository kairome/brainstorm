import RegisterPage from 'pages/Register/RegisterPage';
import LoginPage from 'pages/Login/LoginPage';
import BoardsPage from 'pages/Boards/BoardsPage';
import Board from 'pages/Board/Board';

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
        path: '/',
        element: <BoardsPage />,
      },
      // {
      //   path: '/products',
      //   element: <ProductsPage />,
      // },
      // {
      //   path: '/products/add',
      //   element: <AddEditProduct />,
      // },
      // {
      //   path: '/products/:productId/edit',
      //   element: <AddEditProduct />,
      // },
      // {
      //   path: '/products/:productId',
      //   element: <ProductPage />,
      // },
      // {
      //   path: '/profile',
      //   element: <ProfilePage />,
      // },
      // {
      //   path: '/register-product',
      //   element: <RegisterProductPage />,
      // },
      // {
      //   path: '/register-product/:productId',
      //   element: <RegisterProductPage />,
      // },
      // {
      //   path: '/history/:productId',
      //   element: <HistoryPage />,
      // },
      // {
      //   path: '*',
      //   element: <NotFoundPage />,
      // },
    ],
  },
];