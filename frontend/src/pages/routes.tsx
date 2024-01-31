import Main from './Main.tsx';
import RegisterPage from 'pages/Register/RegisterPage.tsx';
import LoginPage from 'pages/Login/LoginPage.tsx';
import BoardsPage from 'pages/Boards/BoardsPage.tsx';

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
      {
        path: '/',
        element: <BoardsPage />,
      },
      // {
      //   path: '*',
      //   element: <NotFoundPage />,
      // },
    ],
  },
];