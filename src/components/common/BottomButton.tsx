import Button from "./Button";

interface BottomButtonProps {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

const BottomButton = ({
  text,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}: BottomButtonProps) => {
  return (
    <div
      className="
        fixed bottom-0 left-1/2 -translate-x-1/2
        z-40
        w-full max-w-120
        bg-bg
        px-5 pt-4
        pb-[calc(20px+env(safe-area-inset-bottom,0px))]
      "
    >
      <Button
        text={text}
        onClick={onClick}
        variant={variant}
        disabled={disabled}
        type={type}
        className={className}
      />
    </div>
  );
};

export default BottomButton;
