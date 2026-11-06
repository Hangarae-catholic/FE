import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/common/TopBar";
import Modal from "../../components/common/Modal";
import BottomButton from "../../components/common/BottomButton";

type DeleteReason = "INCONVENIENT" | "LOW_USAGE" | null;

const deleteReasons = [
  {
    value: "INCONVENIENT",
    label: "서비스 이용 불편",
  },
  {
    value: "LOW_USAGE",
    label: "서비스 사용 빈도 낮음",
  },
] as const;

const DeleteAccountPage = () => {
  const navigate = useNavigate();

  const [selectedReason, setSelectedReason] = useState<DeleteReason>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    if (!selectedReason) return;

    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (!selectedReason) return;

    try {
      // TODO: 회원탈퇴 API 연동
      // await deleteAccount({ reason: selectedReason });

      console.log("회원탈퇴 사유:", selectedReason);

      setIsDeleteModalOpen(false);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
    }
  };

  return (
    <main
      className="
        relative
        min-h-dvh
        bg-bg
        font-pretendard
        pb-[120px]
      "
    >
      <TopBar title="회원탈퇴" />

      <section className="mt-6">
        <h2
          className="
            text-[20px]
            font-semibold
            text-[#343A40]
          "
        >
          회원 탈퇴 전 주의사항
        </h2>

        <p
          className="
            mt-4
            text-[14px]
            font-normal
            leading-[26px]
            text-[#5C636A]
            break-keep
          "
        >
          탈퇴 시 모든 서비스 이용내역이 삭제되며 복구가 불가능합니다.
          <br />
          또한 같은 계정 정보로 재가입이 7일 동안 불가능 합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2
          className="
            mb-3
            text-[20px]
            font-semibold
            text-[#343A40]
          "
        >
          탈퇴하시는 사유가 어떻게 되나요?
        </h2>

        <div className="flex flex-col gap-3">
          {deleteReasons.map((reason) => {
            const isSelected = selectedReason === reason.value;

            return (
              <button
                key={reason.value}
                type="button"
                onClick={() => setSelectedReason(reason.value)}
                aria-pressed={isSelected}
                className="
                  flex items-center
                  gap-3
                  w-full
                  min-h-[36px]
                  text-left
                  cursor-pointer
                "
              >
                <span
                  className={`
                    flex shrink-0
                    items-center justify-center
                    w-7 h-7
                    rounded-full
                    ${isSelected ? "bg-main" : "bg-[#DEE2E6]"}
                  `}
                >
                  <span
                    className="
                      w-3 h-3
                      rounded-full
                      bg-white
                    "
                  />
                </span>

                <span
                  className="
                    text-[16px]
                    font-normal
                    text-[#343A40]
                  "
                >
                  {reason.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <BottomButton
        text="탈퇴하기"
        disabled={!selectedReason}
        onClick={handleOpenDeleteModal}
      />

      {isDeleteModalOpen && (
        <Modal
          title="정말 탈퇴하시겠어요?"
          content={"탈퇴 시 현재 계정을 더 이상\n이용할 수 없어요."}
          leftBtn="취소"
          cancel={handleCloseDeleteModal}
          rightBtn="탈퇴하기"
          rightBtnColor="RED"
          onClick={handleDeleteAccount}
        />
      )}
    </main>
  );
};

export default DeleteAccountPage;
