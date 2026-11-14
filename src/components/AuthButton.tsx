interface AuthButtonProps {
  text: string;
  icon: string;
  onClick: () => void;
  variant?: "kakao" | "google" | "email";
  disabled?: boolean;
}

const AuthButton = ({
  text,
  icon,
  onClick,
  variant = "email",
  disabled = false,
}: AuthButtonProps) => {
  const buttonStyle = () => {
    if (disabled) {
      return "bg-[#E5E5E5] text-[#999999] font-pretendard font-semibold cursor-not-allowed";
    }

    switch (variant) {
      case "kakao":
        return "bg-[#FEE500] text-[#202124] font-pretendard font-semibold hover:brightness-95";

      case "google":
        return "bg-[#FFFFFF] text-[#283548] font-pretendard font-semibold hover:brightness-95";

      case "email":
      default:
        return "bg-[#202124] text-white font-pretendard font-semibold hover:brightness-90";
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center
        w-full h-[60px]
        gap-3 px-5
        rounded-[16px]
        font-[PretendardVariable]
        font-semibold text-[17px]
        transition-all duration-150
        ${buttonStyle()}
      `}
    >
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="w-[24px] h-[24px] object-contain"
      />
      <span>{text}</span>
    </button>
  );
};

export default AuthButton;
