import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import MainLayout from './layouts/main-layout';

export default function App() {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <MainLayout />,
    },
  ];
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
