import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import MainLayout from './layouts/main-layout';
import LandingPage from './pages/landing-page';
import Home from './pages/home';
import AddEventPage from './pages/add-event-page';

export default function App() {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: 'home',
          element: <Home />,
        },
        {
          path: 'add-event',
          element: <AddEventPage />,
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
