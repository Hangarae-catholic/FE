import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AuthButton from "../components/AuthButton";

import kakaoIcon from "../assets/icons/icon_kakao.svg";
import googleIcon from "../assets/icons/icon_google.svg";
import emailIcon from "../assets/icons/icon_email.svg";
import handshakeCapy from "../assets/images/capy_handshake.svg";
import jumpCapy from "../assets/images/capy_jump.svg";
import landingBackground from "../assets/images/landing_background.svg";
import starIcon from "../assets/icons/icon_star.svg";
import sunIcon from "../assets/icons/icon_sun.svg";
import logoText from "../assets/icons/logo_text.svg";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 연동
  };

  const handleGoogleLogin = () => {
    // TODO: 구글 로그인 연동
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="
        relative flex flex-1 flex-col
        w-full
        overflow-hidden
        bg-[#F7F8FA]
        font-[PretendardVariable]
      "
    >
      <img
        src={landingBackground}
        alt=""
        aria-hidden="true"
        className="
          absolute top-0 left-0
          w-full h-auto
          pointer-events-none
          z-0
        "
      />

      <div
        className="
            relative z-10
            flex flex-col items-end
            mt-[10vh] px-[5%]
            translate-y-[30px]
        "
      >
        <p
          className="
            mb-[10px]
            font-pretendard
            font-bold
            text-[#5C636A]
            text-[clamp(15px,4.7vw,27px)]
            whitespace-nowrap
          "
        >
          찾고, 만나고, 함께하는 학교생활
        </p>

        <img
          src={logoText}
          alt="행가래"
          className="w-[43%] max-w-[180px] h-auto"
        />
      </div>

      <div
        className="
          relative w-full
          h-[clamp(270px,38vh,380px)]
          shrink-0
          pointer-events-none
        "
        aria-hidden="true"
      >
        <img
          src={sunIcon}
          alt=""
          className="
            absolute
            w-[27%]
            top-[-5%] left-[2%]
            z-[1]
          "
        />

        <img
          src={starIcon}
          alt=""
          className="
            absolute
            w-[15%]
            top-[24%] right-[11%]
            z-[1]
          "
        />

        <img
          src={jumpCapy}
          alt=""
          className="
            absolute
            w-[68%]
            top-[-5%]
            z-[2]
          "
        />

        <img
          src={handshakeCapy}
          alt=""
          className="
            absolute
            w-[52%]
            top-[44%] right-[1%]
            z-[3]
          "
        />
      </div>

      <div
        className="
          relative z-20
          flex flex-col items-center
          w-full px-[5.6%]
          mt-auto
        "
      >
        <div className="flex flex-col gap-[14px] w-full">
          <AuthButton
            text="카카오로 시작하기"
            icon={kakaoIcon}
            variant="kakao"
            onClick={handleKakaoLogin}
          />

          <AuthButton
            text="구글로 시작하기"
            icon={googleIcon} // 구글 로그인 아이콘 화질 문제 추후 수정 필요
            variant="google"
            onClick={handleGoogleLogin}
          />

          <AuthButton
            text="아이디로 로그인"
            icon={emailIcon}
            variant="email"
            onClick={() => navigate("/login")}
          />
        </div>

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="
            mt-[20px]
            font-pretendard
            font-medium
            text-[14px]
            text-[#5C636A]
            underline underline-offset-4
            cursor-pointer
          "
        >
          회원가입
        </button>
      </div>

      <div
        className="
          relative z-20
          mt-[52px]
          px-[8%]
          pb-[max(24px,env(safe-area-inset-bottom))]
          font-pretendard
          font-medium
          text-center
          text-[#868E96]
          text-[12px]
          leading-[1.6]
          break-keep
        "
      >
        행가래는 사용자의 개인정보를 소중히 여기며,
        <br />
        관련 법령에 따라 안전하게 보호하고 관리합니다
      </div>
    </div>
  );
};

export default LandingPage;
