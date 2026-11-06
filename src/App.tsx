import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import MainLayout from './layouts/main-layout';
import LandingPage from './pages/auth/landing-page';
import Home from './pages/home-page';
import AddEventPage from './pages/add-event-page';
import TeamMatchingPage from './pages/team-matching';
import TeamMatchDetailPage from './pages/team-matching/detail-page';
import TeamCreatePage from './pages/team-matching/create-page';
import TeamMatchPostEditPage from './pages/team-matching/post-edit-page';
import LoginPage from './pages/auth/login-page';
import ToUPage from './pages/auth/tou-page';
import SignupPage from './pages/auth/signup-page';
import WelcomePage from './pages/auth/welcome-page';
import ProfileSetupPage from './pages/profile/profile-setup-page';
import ProfileInfoPage from './pages/profile/profile-info-page';
import ProfileCompletePage from './pages/profile/profile-complete-page';
import BottomSheetTestPage from './pages/bottom-sheet-test-page';
import MyPage from './pages/my/my-page';
import ManageAccountPage from './pages/my/manage-account-page';
import DeleteAccountPage from './pages/my/delete-account-page';
import ProfileEditPage from './pages/my/profile-edit-page';

export default function App() {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <LandingPage /> },
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
        {
          path: 'team-match/edit/:postId',
          element: <TeamMatchPostEditPage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'tou',
          element: <ToUPage />,
        },
        {
          path: 'signup',
          element: <SignupPage />,
        },
        {
          path: 'welcome',
          element: <WelcomePage />,
        },
        {
          path: 'profile/setup',
          element: <ProfileSetupPage />,
        },
        {
          path: 'profile/info',
          element: <ProfileInfoPage />,
        },
        {
          path: 'profile/complete',
          element: <ProfileCompletePage />,
        },
        {
          path: 'my',
          element: <MyPage />,
        },
        {
          path: 'my/manage',
          element: <ManageAccountPage />,
        },
        {
          path: 'my/delete',
          element: <DeleteAccountPage />,
        },
        {
          path: 'my/edit',
          element: <ProfileEditPage />,
        },
        {
          path: 'test',
          element: <BottomSheetTestPage />,
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
