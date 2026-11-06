import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import MainLayout from "./layouts/main-layout";
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login-page";
import ToUPage from "./pages/tou-page";
import SignupPage from "./pages/signup-page";
import WelcomePage from "./pages/welcome-page";

export default function App() {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: "login", element: <LoginPage /> },
        { path: "tou", element: <ToUPage /> },
        { path: "signup", element: <SignupPage /> },
        { path: "welcome", element: <WelcomePage /> },
      ],
    },
  ];
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
