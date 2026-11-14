import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TopBar from "../../components/common/TopBar";
import BottomButton from "../../components/common/BottomButton";

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

interface TermsBoxProps {
  content: string;
}

const TermsBox = ({ content }: TermsBoxProps) => {
  return (
    <div
      className="
        w-full h-[108px]
        overflow-y-auto
        rounded-[12px]
        border border-[#CED4DA]
        px-5 py-3
        text-[12px]
        font-pretendard font-regular
        leading-[1.6]
        text-[#868E96]
        whitespace-pre-line
      "
    >
      {content}
    </div>
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

  // 추후 내용 제대로 나오면 수정
  const termsContent = `본 이용약관은(이하 “이용약관”은 행가래 웹 및~본 이용약관은(이하 “이용약관”은 행가래 웹 및~본 이용약관은(이하 “이용약관”은 행가래 웹 및~본 이용약관은(이하 “이용약관”은 행가래 웹 및~본 이용약관은(이하 “이용약관”은 행가래 웹 및~ 본 이용약관은(이하 “이용약관”은 행가래 웹 및~본 이용약관은(이하 “이용약관”은 행가래 웹 및~본 이용약관은(이하 “이용약관”은 행가래 웹 및~본 이용약관은(이하 “이용약관”은 행가래 웹 및~본 이용약관은(이하 “이용약관”은 행가래 웹 및~본 이용약관은(이하 “이용약관”은 행가래 웹 및~`;

  const privacyContent = `‘행가래’(이하 서비스)는 「개인정보 보호법」 등 관계 법령에 따라 이용자의 개인정보를 안전하게 보호하며 다음과 같이 개인정보를 처리합니다.
1. 수집하는 개인정보
회원가입 시
아이디
이메일
비밀번호(암호화 저장)
닉네임
학사 정보
서비스 이용 시
로그인 기록
접속 IP
기기 정보
쿠키
서비스 이용 기록
2. 개인정보 이용 목적
본 서비스는 다음의 목적으로 개인정보를 이용합니다.
회원 식별 및 본인 인증
맞춤형 행사 정보 제공
팀매칭 기능 제공
서비스 개선 및 통계 분석
3. 개인정보 보유 및 이용기간
회원 탈퇴 시 개인정보는 지체 없이 파기합니다.
관계 법령에 따라 보관이 필요한 경우에는 해당 기간 동안 보관합니다.
4. 개인정보의 제3자 제공
본 서비스는 이용자의 개인정보를 외부에 제공하지 않습니다. 다만 다음의 경우는 예외로 합니다.
이용자의 사전 동의가 있는 경우
법령에 따른 요청이 있는 경우
5. 개인정보 처리 위탁
서비스 운영을 위해 필요한 경우 일부 업무를 전문 업체에 위탁할 수 있으며, 위탁 시 관련 법령을 준수합니다.
6. 이용자의 권리
이용자는 언제든지 다음 권리를 행사할 수 있습니다.
개인정보 조회
개인정보 수정
개인정보 삭제 요청
회원 탈퇴
7. 개인정보 보호 조치
본 서비스는 개인정보 보호를 위해 다음과 같은 조치를 시행합니다.
비밀번호 암호화 저장
HTTPS 기반 암호화 통신
접근 권한 최소화
접근 기록 관리
정기적인 보안 점검
8. 쿠키의 사용
서비스는 이용자의 편의를 위해 쿠키를 사용할 수 있으며, 브라우저 설정을 통해 저장을 거부할 수 있습니다.
9. 개인정보처리방침 변경
본 방침은 관련 법령 또는 서비스 정책 변경 시 개정될 수 있으며, 변경 내용은 서비스 내 공지사항을 통해 안내합니다.`;

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
