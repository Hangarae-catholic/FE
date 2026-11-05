import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import MainLayout from './layouts/main-layout';
import LandingPage from './pages/landing-page';
import Home from './pages/home';
import AddEventPage from './pages/add-event-page';
import TeamMatchingPage from './pages/team-matching';
import TeamMatchDetailPage from './pages/team-matching/detail-page';
import TeamCreatePage from './pages/team-matching/create-page';

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
        {
          path: 'team-match',
          element: <TeamMatchingPage />,
        },
        {
          path: 'team-match/:postId',
          element: <TeamMatchDetailPage />,
        },
        {
          path: 'team-match/create',
          element: <TeamCreatePage />,
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
