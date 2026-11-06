import { useEffect, useState } from "react";

interface ProgressBarProps {
  step: 1 | 2 | 3;
}

const ProgressBar = ({ step }: ProgressBarProps) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (step !== 3) return;

    const timer = window.setTimeout(() => {
      setCompleted(true);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [step]);

  return (
    <div
      role="progressbar"
      aria-label="프로필 생성 진행 상태"
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuenow={step}
      className="relative flex w-full gap-2 h-2"
    >
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className={`
            flex-1 h-2 rounded-full
            ${step === item ? "bg-main" : "bg-[#DEE2E6]"}
            transition-opacity duration-300
            ${completed && step === 3 ? "opacity-0" : "opacity-100"}
          `}
        />
      ))}

      {step === 3 && (
        <div
          className={`
            absolute top-0 right-0 h-2
            rounded-full bg-main
            transition-[width] duration-1000
            ease-[cubic-bezier(0.22,1,0.36,1)]
            ${completed ? "w-full" : "w-[calc((100%-16px)/3)]"}
          `}
        />
      )}
    </div>
  );
};

export default ProgressBar;
