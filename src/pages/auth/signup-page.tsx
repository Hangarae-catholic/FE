import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Button from "../../components/common/Button";
import TopBar from "../../components/common/TopBar";
import { sendEmailCode, signUp, verifyEmailCode } from "../../apis/auth";

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
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [signupError, setSignupError] = useState("");

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,16}$/;

  const isPasswordValid = passwordRegex.test(password);

  const isPasswordMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const canSignup =
    isEmailVerified &&
    name.trim().length > 0 &&
    !isSigningUp &&
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
  const handleSendCode = async () => {
    if (!email.trim() || isSendingCode) return;

    setIsSendingCode(true);
    setEmailError("");

    try {
      const response = await sendEmailCode({
        email: email.trim(),
        purpose: "JOIN",
      });

      console.log("이메일 발송 API 응답:", response);

      if (response.code !== "AUTH010" || response.httpStatus !== "200 OK") {
        console.error("예상과 다른 응답 코드:", response.code);
        setEmailError(response.message || "인증번호 발송에 실패했습니다.");
        return;
      }

      setIsCodeSent(true);
      setVerificationCode("");
      setTimeLeft(180);
    } catch (error) {
      console.error("인증번호 발송 오류:", error);

      if (axios.isAxiosError(error)) {
        console.error("HTTP 상태:", error.response?.status);
        console.error("서버 응답:", error.response?.data);

        setEmailError(
          error.response?.data?.message ||
            "인증번호 발송 중 오류가 발생했습니다.",
        );
      } else {
        setEmailError(
          error instanceof Error
            ? error.message
            : "인증번호 발송 중 오류가 발생했습니다.",
        );
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  // 이메일 인증번호 검증
  const handleVerifyEmail = async () => {
    if (!isCodeSent || timeLeft <= 0) return;
    if (!verificationCode.trim() || isVerifyingCode) return;

    setIsVerifyingCode(true);
    setEmailError("");

    try {
      const response = await verifyEmailCode({
        email: email.trim(),
        type: "JOIN",
        code: verificationCode.trim(),
      });

      console.log("이메일 인증 응답:", response);

      if (
        response.code === "AUTH011" &&
        response.message === "인증되었습니다."
      ) {
        setIsEmailVerified(true);
      } else {
        setEmailError(response.message || "이메일 인증에 실패했습니다.");
      }
    } catch (error) {
      console.error("이메일 인증 오류:", error);

      if (axios.isAxiosError(error)) {
        setEmailError(
          error.response?.data?.message ||
            "인증번호가 올바르지 않거나 만료되었습니다.",
        );
      } else {
        setEmailError(
          error instanceof Error
            ? error.message
            : "이메일 인증 중 오류가 발생했습니다.",
        );
      }
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // 로컬 회원가입
  const handleSignup = async () => {
    if (!canSignup || isSigningUp) return;

    setIsSigningUp(true);
    setSignupError("");

    const body = {
      name: name.trim(),
      loginId: email.trim(),
      password,
      confirmPassword,
    };

    try {
      const response = await signUp(body);

      console.log("회원가입 성공 응답:", response);
      navigate("/welcome", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("HTTP 상태:", error.response?.status);
        console.error("백엔드 응답:", error.response?.data);

        setSignupError(
          error.response?.data?.message || "회원가입에 실패했습니다.",
        );
      } else {
        console.error("회원가입 오류:", error);
        setSignupError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSigningUp(false);
    }
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
  `;

  return (
    <main
      className="
  flex flex-1 flex-col
  w-full min-h-0
  bg-bg font-pretendard
"
    >
      <TopBar />

      <section className="flex flex-col pt-[45px]">
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
                  setIsEmailVerified(false);
                  setVerificationCode("");
                  setTimeLeft(0);
                  setEmailError("");
                }}
                placeholder="이메일 입력"
                autoComplete="email"
                aria-label="이메일"
                className={`${inputStyle} min-w-0 flex-1`}
              />

              <button
                type="button"
                onClick={handleSendCode}
                disabled={!email.trim() || isSendingCode || isCodeSent}
                className="
    shrink-0 h-[52px]
    px-5
    rounded-[12px]
    border border-[#FB811C]
    bg-transparent
    text-[#FB811C] text-[16px]
    font-semibold
    cursor-pointer
    hover:bg-[#FFF4EA]
    active:bg-[#FFE8D5]
    disabled:border-[#CED4DA]
    disabled:bg-[#F1F3F5]
    disabled:text-[#ADB5BD]
    disabled:cursor-not-allowed
    disabled:opacity-100
    disabled:hover:bg-[#F1F3F5]
    transition-colors duration-150
  "
              >
                {isSendingCode
                  ? "발송 중"
                  : isCodeSent
                    ? "발송 완료"
                    : "인증 받기"}
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
                disabled={!email.trim() || isSendingCode}
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

            {emailError && (
              <p role="alert" className="mt-3 px-[2px] text-[14px] text-error">
                {emailError}
              </p>
            )}

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

            {signupError && (
              <p role="alert" className="mt-3 px-[2px] text-[14px] text-error">
                {signupError}
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
              text-[#FB811C]
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
