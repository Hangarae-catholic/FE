import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import MainLayout from "./layouts/main-layout";
import LandingPage from "./pages/landing-page";

export default function App() {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <MainLayout />,
      children: [{ index: true, element: <LandingPage /> }],
    },
  ];
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
