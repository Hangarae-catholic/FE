import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AuthStore } from "../../store/AuthStore";
import { getOAuthTicket } from "../../apis/auth";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { UserStore } from "../../store/UserStore";

const SocialOAuthHandler = () => {
  const navigate = useNavigate();
  const processedRef = useRef(false);
  const setAuth = AuthStore((state) => state.setAuth);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const ticket = new URLSearchParams(window.location.search).get("ticket");

    if (!ticket) {
      console.error("OAuth 티켓이 없습니다.");
      navigate("/login", { replace: true });
      return;
    }

    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname,
    );

    const handleOAuthResult = async () => {
      try {
        const response = await getOAuthTicket({ ticket });
        const data = response.data;

        // 소셜 로그인 API 응답 확인 (토큰 값 제외)
        console.log("[OAuth] 로그인 응답:", {
          code: response.code,
          message: response.message,
          httpStatus: response.httpStatus,
          data: data
            ? {
                ...data,
                tokens: data.tokens
                  ? {
                      accessToken: "[REDACTED]",
                      refreshToken: "[REDACTED]",
                    }
                  : null,
              }
            : null,
        });

        if (!data) {
          throw new Error("OAuth 로그인 응답 데이터가 없습니다.");
        }

        switch (data.nextStep) {
          case "LOGIN": {
            if (!data.tokens?.accessToken || !data.tokens?.refreshToken) {
              throw new Error("로그인 토큰이 없습니다.");
            }

            setAuth(data.tokens);

            const user = await UserStore.getState().fetchUser();

            if (!user) {
              throw new Error("사용자 정보를 불러오지 못했습니다.");
            }

            navigate("/home", { replace: true });
            return;
          }

          case "SIGN_UP":
          case "PROFILE_SETUP": {
            // 토큰이 발급된 경우 먼저 저장
            if (data.tokens?.accessToken && data.tokens?.refreshToken) {
              setAuth(data.tokens);
            }

            navigate("/tou", {
              replace: true,
              state: {
                signupType: "SOCIAL",
                email: data.email,
                name: data.name,
              },
            });
            return;
          }

          default:
            throw new Error("알 수 없는 소셜 로그인 상태입니다.");
        }
      } catch (error) {
        console.error("소셜 로그인 처리 실패:", error);

        navigate("/login", {
          replace: true,
          state: {
            error: "소셜 로그인에 실패했습니다.",
          },
        });
      }
    };

    void handleOAuthResult();
  }, [navigate, setAuth]);

  return <LoadingSpinner />;
};

export default SocialOAuthHandler;
