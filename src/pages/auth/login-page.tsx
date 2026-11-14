import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../apis/auth";
import { AuthStore } from "../../store/AuthStore";

import Button from "../../components/common/Button";
import TopBar from "../../components/common/TopBar";
import visibleIcon from "../../assets/icons/icon_visible.svg";
import invisibleIcon from "../../assets/icons/icon_invisible.svg";
import { checkProfile } from "../../apis/user";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { UserStore } from "../../store/UserStore";

const LoginPage = () => {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const setAuth = AuthStore((state) => state.setAuth);

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return <LoadingSpinner />;

    setIsLoading(true);
    setLoginError(false);

    try {
      const response = await login({
        loginId: loginId.trim(),
        password,
      });

      if (response.code !== "AUTH002" || !response.data) {
        throw new Error(response.message || "로그인에 실패했습니다.");
      }

      const { accessToken, refreshToken } = response.data;

      if (!accessToken || !refreshToken) {
        throw new Error("로그인 토큰이 없습니다.");
      }

      setAuth({ accessToken, refreshToken });

      const profileResponse = await checkProfile();

      if (profileResponse.data === true) {
        const user = await UserStore.getState().fetchUser();

        if (!user) {
          throw new Error("사용자 정보를 불러오지 못했습니다.");
        }
        navigate("/home", { replace: true });
      } else if (profileResponse.data === false) {
        navigate("/profile/setup", { replace: true });
      } else {
        throw new Error("프로필 생성 여부를 확인할 수 없습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
        flex flex-1 flex-col
        w-full min-h-dvh
        bg-bg
        font-pretendard
      "
    >
      <TopBar />

      <section className="flex flex-col pt-[45px]">
        <div>
          <h1
            className="
              text-[24px]
              font-bold
              text-gray-900
            "
          >
            로그인
          </h1>

          <p
            className="
              mt-1
              text-[14px]
              font-pretendard
            font-regular
              text-[#5C636A]
            "
          >
            행가래와 함께 편리한 학교 생활 시작하기
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="flex flex-col mt-[40px]"
        >
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="이메일 입력"
            autoComplete="username"
            aria-label="이메일"
            className="
              w-full h-[52px]
              px-5
              rounded-[12px]
              bg-[#E9ECEF]
              font-pretendard font-regular
              text-[#343A40]
              text-[16px]
              placeholder:text-[#ADB5BD]
              outline-none
            "
          />

          <div className="relative mt-3">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError(false);
              }}
              placeholder="비밀번호(영문+숫자+특수문자, 8-16자) 입력"
              autoComplete="current-password"
              className="
      w-full h-[52px]
      px-5 pr-14
      rounded-[12px]
      bg-[#E9ECEF]
      font-pretendard font-regular
      text-[#343A40] text-[16px]
      placeholder:text-[#ADB5BD]
      outline-none
    "
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              className="
    absolute right-4 top-1/2 -translate-y-1/2
    flex items-center justify-center
    w-5 h-5
    cursor-pointer
  "
            >
              <img
                src={showPassword ? visibleIcon : invisibleIcon}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain"
              />
            </button>
          </div>

          {loginError && (
            <p
              role="alert"
              className="
                mt-3 px-1
                font-pretendard
                text-[14px]
                text-error
              "
            >
              이메일 또는 비밀번호를 확인해주세요.
            </p>
          )}

          <div className="mt-5">
            <Button text="로그인" onClick={handleLogin} />
          </div>
        </form>

        <nav
          aria-label="계정 찾기 및 회원가입"
          className="
            flex items-center justify-center
            gap-3 mt-5
            text-[14px]
            font-medium
            text-gray-600
          "
        >
          <button
            type="button"
            onClick={() => navigate("/find-id")}
            className="cursor-pointer"
          >
            아이디 찾기
          </button>

          <span aria-hidden="true">|</span>

          <button
            type="button"
            onClick={() => navigate("/find-password")}
            className="cursor-pointer"
          >
            비밀번호 찾기
          </button>

          <span aria-hidden="true">|</span>

          <button
            type="button"
            onClick={() => navigate("/tou")}
            className="
              text-main underline
              underline-offset-4
              cursor-pointer
              font-normal
            "
          >
            회원가입
          </button>
        </nav>
      </section>
    </div>
  );
};

export default LoginPage;
