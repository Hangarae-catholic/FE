import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";
import backIcon from "../assets/icons/icon_back.svg";
import visibleIcon from "../assets/icons/icon_visible.svg";
import invisibleIcon from "../assets/icons/icon_invisible.svg";

const LoginPage = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // 추후 로그인 API 연동
  const handleLogin = async () => {
    setLoginError(false);

    // TODO: 실제 로그인 API 연동

    const isLoginSuccess = false;

    if (isLoginSuccess) {
      navigate("/home");
    } else {
      setLoginError(true);
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
      <header className="px-5 pt-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
          className="
            flex items-center justify-center
            w-6 h-6
            text-gray-700
            cursor-pointer
          "
        >
          <img
            src={backIcon}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain"
          />
        </button>
      </header>

      <section className="flex flex-col px-5 pt-[45px]">
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
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디 입력"
            autoComplete="username"
            aria-label="아이디"
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
              focus:ring-2 focus:ring-main/30
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
              placeholder="비밀번호(영문+숫자, 8-16자) 입력"
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
      focus:ring-2 focus:ring-main/30
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
            className="cursor-pointer hover:underline"
          >
            아이디 찾기
          </button>

          <span aria-hidden="true">|</span>

          <button
            type="button"
            onClick={() => navigate("/find-password")}
            className="cursor-pointer hover:underline"
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
