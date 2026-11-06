interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

const Button = ({
  text,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) => {
  const getButtonStyle = () => {
    if (disabled) {
      return "bg-[#F36B0A] text-white/50 cursor-not-allowed";
    }

    switch (variant) {
      case "secondary":
        return "bg-white text-main border border-main hover:bg-orange-50";

      case "primary":
      default:
        return "bg-main text-white hover:brightness-95";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center
        w-full h-[60px]
        rounded-[12px]
        font-pretendard font-semibold text-[16px]
        transition-all duration-150
        ${getButtonStyle()}
        ${className}
      `}
    >
      {text}
    </button>
  );
};

export default Button;
