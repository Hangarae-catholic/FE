import { useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import welcomeCapy from "../../assets/images/capy_welcome.svg";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // TODO: 프로필 설정 페이지 경로에 맞게 수정
    navigate("/profile/setup", { replace: true });
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <div
      className="
  flex flex-1 flex-col
  w-full min-h-0
  bg-bg font-pretendard
"
    >
      <div
        className="
          flex flex-col
          items-center
          w-full
          px-5
          pt-[10vh]
        "
      >
        <img
          src={welcomeCapy}
          alt="환영하는 카피바라"
          className="
            w-[80%]
            max-w-[300px]
            h-auto
            object-contain
          "
        />

        <div
          className="
            flex flex-col
            items-center
            mt-[16px]
            text-center
          "
        >
          <h1
            className="
              font-bold
              text-[24px]
              text-[#343A40]
              whitespace-nowrap
            "
          >
            행가래에 오신 걸 환영해요!
          </h1>

          <p
            className="
              mt-2
              font-normal
              text-[16px]
              text-[#5C636A]
            "
          >
            이제 행가래에서 사용할 정보를 설정해요.
          </p>
        </div>

        <div className="w-full mt-[28px]">
          <Button text="바로 시작하기" onClick={handleStart} />
        </div>

        <button
          type="button"
          onClick={handleGoHome}
          className="
            mt-[16px]
            font-normal
            text-[14px]
            text-[#5C636A]
            underline underline-offset-4
            cursor-pointer
          "
        >
          첫 화면으로
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
