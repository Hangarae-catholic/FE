import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";
import backIcon from "../assets/icons/icon_back.svg";

const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isConfirmTouched, setIsConfirmTouched] = useState(false);

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;

  const isPasswordValid = passwordRegex.test(password);

  const isPasswordMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const canSignup =
    isEmailVerified &&
    name.trim().length > 0 &&
    isPasswordValid &&
    isPasswordMatch;

  // 인증번호 타이머
  useEffect(() => {
    if (!isCodeSent || isEmailVerified || timeLeft <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isCodeSent, isEmailVerified, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  // 이메일 인증번호 발송
  const handleSendCode = () => {
    if (!email.trim()) return;

    // TODO: 이메일 인증번호 발송 API 연동
    setIsCodeSent(true);
    setVerificationCode("");
    setTimeLeft(180);
  };

  // 이메일 인증 확인
  const handleVerifyEmail = () => {
    if (!isCodeSent || timeLeft <= 0) return;
    if (!verificationCode.trim()) return;

    // TODO: 인증번호 검증 API 연동
    // 서버 인증 성공 시에만 아래 상태 변경

    setIsEmailVerified(true);
  };

  // 회원가입
  const handleSignup = () => {
    if (!canSignup) return;

    // TODO: 회원가입 API 연동
  };

  const inputStyle = `
    w-full h-[52px]
    px-5
    rounded-[12px]
    bg-gray-200
    font-pretendard font-medium
    text-gray-900 text-[16px]
    placeholder:text-[#ADB5BD]
    outline-none
    focus:ring-2 focus:ring-main/30
  `;

  return (
    <main
      className="
        flex flex-1 flex-col
        w-full min-h-dvh
        bg-bg font-pretendard
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
          <h1 className="text-[24px] font-bold text-[#343A40]">회원가입</h1>

          <p className="mt-1 text-[14px] font-normal text-[#5C636A]">
            {isEmailVerified
              ? "아이디와 비밀번호를 설정해주세요"
              : "가입에 사용할 이메일을 인증해주세요"}
          </p>
        </div>

        {!isEmailVerified ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyEmail();
            }}
            className="flex flex-col mt-[28px]"
          >
            <div className="flex w-full gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsCodeSent(false);
                  setVerificationCode("");
                  setTimeLeft(0);
                }}
                placeholder="이메일 입력"
                autoComplete="email"
                aria-label="이메일"
                className={`${inputStyle} min-w-0 flex-1`}
              />

              <button
                type="button"
                onClick={handleSendCode}
                disabled={!email.trim()}
                className="
                  shrink-0 h-[52px]
                  px-5
                  rounded-[12px]
                  border border-[#FB811C]
                  bg-transparent
                  text-[#FB811C] text-[16px]
                  font-semibold
                  cursor-pointer
                  hover:bg-orange-50
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  transition-colors duration-150
                "
              >
                인증 받기
              </button>
            </div>

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증번호 입력"
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label="인증번호"
              className={`${inputStyle} mt-3`}
            />

            <div
              className="
                flex items-center justify-between
                mt-3 px-[2px]
                text-[14px] text-[#868E96]
              "
            >
              <span>남은 시간 {formatTime(isCodeSent ? timeLeft : 180)}</span>

              <button
                type="button"
                onClick={handleSendCode}
                disabled={!email.trim()}
                className="
                  underline underline-offset-4
                  cursor-pointer
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                인증번호 재전송
              </button>
            </div>

            <div className="mt-5">
              <Button
                text="다음"
                type="submit"
                disabled={
                  !isCodeSent || timeLeft <= 0 || !verificationCode.trim()
                }
              />
            </div>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
            className="flex flex-col mt-[28px]"
          >
            <input
              type="email"
              value={email}
              readOnly
              aria-label="인증 완료 이메일"
              className={`${inputStyle} cursor-default`}
            />

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름 입력"
              autoComplete="name"
              aria-label="이름"
              className={`${inputStyle} mt-3`}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="비밀번호(영문+숫자, 8-16자) 입력"
              autoComplete="new-password"
              aria-label="비밀번호"
              aria-describedby={
                password.length > 0 ? "password-validation" : undefined
              }
              className={`${inputStyle} mt-3`}
            />

            {password.length > 0 && (
              <p
                id="password-validation"
                aria-live="polite"
                className={`
                  mt-3 px-[2px]
                  text-[14px]
                  ${isPasswordValid ? "text-success" : "text-error"}
                `}
              >
                {isPasswordValid
                  ? "사용할 수 있는 비밀번호예요."
                  : "영문과 숫자를 조합해 8~16자로 입력해 주세요."}
              </p>
            )}

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setIsConfirmTouched(true);
              }}
              onBlur={() => setIsConfirmTouched(true)}
              placeholder="비밀번호 확인 입력"
              autoComplete="new-password"
              aria-label="비밀번호 확인"
              aria-describedby={
                isConfirmTouched && confirmPassword.length > 0
                  ? "confirm-password-error"
                  : undefined
              }
              className={`${inputStyle} mt-3`}
            />

            {isConfirmTouched &&
              confirmPassword.length > 0 &&
              !isPasswordMatch && (
                <p
                  id="confirm-password-error"
                  role="alert"
                  className="
                    mt-3 px-[2px]
                    text-[14px]
                    text-error
                    leading-[22px]
                  "
                >
                  비밀번호를 확인해주세요.
                </p>
              )}

            <div className="mt-5">
              <Button text="가입하기" type="submit" disabled={!canSignup} />
            </div>
          </form>
        )}

        <div
          className="
            flex items-center justify-center
            gap-3 mt-5
            text-[14px] font-regular
            text-gray-700
          "
        >
          <span>이미 계정이 있으신가요?</span>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              text-main
              underline underline-offset-4
              cursor-pointer
            "
          >
            로그인
          </button>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
