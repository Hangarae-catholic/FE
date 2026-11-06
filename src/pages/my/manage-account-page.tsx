import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/common/TopBar";
import RightArrow from "../../assets/icons/arrow_right.svg?react";
import Modal from "../../components/common/Modal";

const ManageAccountPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);

    navigate("/", { replace: true });
  };

  const handleWithdraw = () => {
    navigate("/my/delete");
  };

  return (
    <main
      className="
        min-h-dvh
        bg-bg
        font-pretendard
      "
    >
      <TopBar title="계정 관리" />

      <section
        className="
          mt-6
          w-full
          rounded-[20px]
          bg-white
          px-5 py-4
        "
      >
        {/* 카드 제목 */}
        <h2
          className="
            mb-3
            text-[14px]
            font-normal
            text-[#6C757D]
          "
        >
          계정 로그아웃 및 탈퇴
        </h2>

        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="
            flex items-center justify-between
            w-full h-[48px]
            text-left
            cursor-pointer
          "
        >
          <span
            className="
              text-[16px]
              font-normal
              text-[#343A40]
            "
          >
            로그아웃
          </span>

          <RightArrow
            className="
              w-5 h-5
              text-[#6C757D]
            "
          />
        </button>

        <button
          type="button"
          onClick={handleWithdraw}
          className="
            flex items-center justify-between
            w-full h-[48px]
            text-left
            cursor-pointer
          "
        >
          <span
            className="
              text-[16px]
              font-normal
              text-[#343A40]
            "
          >
            탈퇴하기
          </span>

          <RightArrow
            className="
              w-5 h-5
              text-[#6C757D]
            "
          />
        </button>
      </section>

      {isLogoutModalOpen && (
        <Modal
          title="로그아웃하시겠어요?"
          content={"로그아웃하면 다시 로그인해야\n서비스를 이용할 수 있어요."}
          leftBtn="취소"
          cancel={() => setIsLogoutModalOpen(false)}
          rightBtn="로그아웃"
          rightBtnColor="ORANGE"
          onClick={handleLogout}
        />
      )}
    </main>
  );
};

export default ManageAccountPage;
