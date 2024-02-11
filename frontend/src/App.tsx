import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from 'pages/routes';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Alerts from 'ui/Alerts/Alerts';

export const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Alerts />
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
