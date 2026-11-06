import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ProgressBar from "../../components/common/ProgressBar";
import check from "../../assets/icons/check.svg";

const ProfileCompletePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [navigate]);
  return (
    <main
      className="
        relative flex flex-none flex-col
        w-[calc(100%+40px)]
        -mx-5 -mt-15
        h-dvh min-h-0
        overflow-hidden
        bg-bg
        font-pretendard
      "
    >
      <div className="shrink-0 px-5 pt-16">
        <ProgressBar step={3} />
      </div>

      <div
        className="
          flex flex-1 flex-col
          items-center justify-center
          px-5
          pb-16
        "
      >
        <img
          src={check}
          alt=""
          aria-hidden="true"
          className="w-[clamp(100px,20vw,100px)] h-auto"
        />

        <h1
          className="
            mt-5
            text-[24px]
            font-bold
            text-[#343A40]
            text-center
            break-keep
          "
        >
          모든 준비가 끝났어요!
        </h1>

        <p
          className="
            mt-2
            text-[16px]
            font-normal
            text-[#5C636A]
            text-center
          "
        >
          이제 바로 시작해요
        </p>
      </div>
    </main>
  );
};

export default ProfileCompletePage;
