import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TermsBox from "../../components/common/TermsBox";
import TopBar from "../../components/common/TopBar";
import BottomButton from "../../components/common/BottomButton";
import termsContent from "../../constants/TERMS.md?raw";
import privacyContent from "../../constants/PRIVACY.md?raw";

interface CheckIconProps {
  checked: boolean;
  isAll?: boolean;
}

const CheckIcon = ({ checked, isAll = false }: CheckIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 12L9 17L20 6"
        stroke={checked ? (isAll ? "#FFFFFF" : "#F36B0A") : "#868E96"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ToUPage = () => {
  const navigate = useNavigate();

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const allAgreed = agreeTerms && agreePrivacy;

  const location = useLocation();

  const signupType = (
    location.state as {
      signupType?: "SOCIAL";
      email?: string | null;
      name?: string | null;
    } | null
  )?.signupType;

  const handleAllAgree = () => {
    const nextValue = !allAgreed;
    setAgreeTerms(nextValue);
    setAgreePrivacy(nextValue);
  };

  const handleAgree = () => {
    if (!allAgreed) return;

    if (signupType === "SOCIAL") {
      navigate("/profile/setup", {
        state: location.state,
      });
      return;
    }

    navigate("/signup");
  };

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
      <TopBar />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className="px-5 pt-[105px]">
          <h1 className="text-[24px] font-bold text-[#343A40]">
            이용 약관 동의
          </h1>

          <button
            type="button"
            onClick={handleAllAgree}
            aria-pressed={allAgreed}
            className={`
    flex items-center
    w-full h-[52px]
    mt-6 px-4
    rounded-[12px]
    cursor-pointer
    transition-colors duration-150
    ${allAgreed ? "bg-main" : "bg-[#E9ECEF]"}
  `}
          >
            <CheckIcon checked={allAgreed} isAll />

            <span
              className={`
      flex-1 text-center
      text-[16px]
      font-medium
      transition-colors duration-150
      ${allAgreed ? "text-white" : "text-[#343A40]"}
    `}
            >
              네, 모두 동의합니다.
            </span>

            <div className="w-6" />
          </button>
        </section>

        <section className="flex flex-col gap-10 px-5 mt-7">
          <div>
            <button
              type="button"
              onClick={() => setAgreeTerms(!agreeTerms)}
              aria-pressed={agreeTerms}
              className="
                flex items-center gap-3
                mb-3
                cursor-pointer
                pl-4
              "
            >
              <CheckIcon checked={agreeTerms} />

              <span
                className="
                  text-[16px]
                  font-medium
                  text-gray-900
                "
              >
                이용약관
                <span className="ml-1 text-error">(필수)</span>
              </span>
            </button>

            <TermsBox content={termsContent} />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setAgreePrivacy(!agreePrivacy)}
              aria-pressed={agreePrivacy}
              className="
                flex items-center gap-3
                mb-3
                cursor-pointer
                pl-4
              "
            >
              <CheckIcon checked={agreePrivacy} />

              <span
                className="
                  text-[16px]
                  font-medium
                  text-gray-900
                "
              >
                개인정보 수집 및 이용 동의
                <span className="ml-1 text-error">(필수)</span>
              </span>
            </button>

            <TermsBox content={privacyContent} />
          </div>
        </section>
      </div>

      <BottomButton
        text="동의합니다"
        onClick={handleAgree}
        disabled={!allAgreed}
      />
    </main>
  );
};

export default ToUPage;
