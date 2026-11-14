import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/common/TopBar";
import RightArrow from "../../assets/icons/arrow_right.svg?react";
import Modal from "../../components/common/Modal";
import { AuthStore } from "../../store/AuthStore";
import { UserStore } from "../../store/UserStore";
import axios from "axios";
import { logout } from "../../apis/auth";

const ManageAccountPage = () => {
  const navigate = useNavigate();

  const clearAuth = AuthStore((state) => state.clearAuth);
  const clearUser = UserStore((state) => state.clearUser);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await logout();

      clearAuth();

      clearUser();

      setIsLogoutModalOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("로그아웃 실패:", error);

      setLogoutError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "로그아웃에 실패했습니다.")
          : "로그아웃에 실패했습니다. 다시 시도해주세요.",
      );

      setIsLogoutModalOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
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

      {logoutError && (
        <p role="alert" className="mt-4 text-center text-[14px] text-error">
          {logoutError}
        </p>
      )}

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
