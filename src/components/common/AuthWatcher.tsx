import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthStore } from "../../store/AuthStore";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/tou",
  "/find-id",
  "/find-password",
  "/welcome",
  "/profile/setup",
  "/profile/info",
  "/profile/complete",
  "/auth/oauth/result",
];

const AuthWatcher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = AuthStore((state) => state.accessToken);

  const isPublicPage = PUBLIC_PATHS.includes(location.pathname);

  const previousToken = useRef(accessToken);

  useEffect(() => {
    if (previousToken.current && !accessToken) {
      if (!isPublicPage) {
        navigate("/", { replace: true });
      }
    }

    previousToken.current = accessToken;
  }, [accessToken, isPublicPage, navigate]);

  return null;
};

export default AuthWatcher;
