import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStore } from "../../store/AuthStore";
import { kakaoCallback } from "../../apis/auth";

const KakaoOAuthHandler = () => {
  const navigate = useNavigate();
  const processedRef = useRef(false);
  const setAuth = AuthStore((state) => state.setAuth);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      console.error("카카오 인가 코드가 없습니다.");
      navigate("/login", { replace: true });
      return;
    }

    const handleKakaoCallback = async () => {
      try {
        const response = await kakaoCallback({ code });
        const data = response.data;

        if (!data) {
          throw new Error("카카오 로그인 응답 데이터가 없습니다.");
        }

        switch (data.nextStep) {
          case "LOGIN": {
            if (!data.tokens?.accessToken || !data.tokens?.refreshToken) {
              throw new Error("카카오 로그인 토큰이 없습니다.");
            }

            // 기존 사용자: 토큰 저장 후 홈 이동
            setAuth(data.tokens);
            navigate("/home", { replace: true });
            return;
          }

          case "SIGN_UP": {
            // 신규 사용자: 약관 동의 페이지 이동
            navigate("/tou", {
              replace: true,
              state: {
                signupType: "KAKAO",
                email: data.email,
                name: data.name,
              },
            });
            return;
          }

          default:
            throw new Error("알 수 없는 카카오 로그인 상태입니다.");
        }
      } catch (error) {
        console.error("카카오 로그인 실패:", error);
        navigate("/login", { replace: true });
      }
    };

    void handleKakaoCallback();
  }, [navigate, setAuth]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoOAuthHandler;
