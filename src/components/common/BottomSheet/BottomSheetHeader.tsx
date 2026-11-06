import x from "../../../assets/icons/x-black.svg";

interface BottomSheetHeaderProps {
  title: string;
  description?: string;
  onClose: () => void;
  titleId: string;
}

const BottomSheetHeader = ({
  title,
  description,
  onClose,
  titleId,
}: BottomSheetHeaderProps) => {
  return (
    <div className="shrink-0 bg-bg">
      <div
        className="
          flex items-center justify-center
          w-full h-10
          cursor-grab
          select-none
        "
      >
        <div
          className="
            w-10 h-1
            rounded-full
            bg-gray-500
          "
        />
      </div>

      <div
        className="
          flex items-start justify-between
          gap-4 px-5 pt-3 pb-1
        "
      >
        <div className="min-w-0 flex-1">
          <h2
            id={titleId}
            className="
              text-[18px]
              font-pretendard
              font-semibold
              text-[#343A40]
            "
          >
            {title}
          </h2>

          {description && (
            <p
              className="
                mt-3
                text-[14px] leading-6
                font-pretendard
                font-normal
                text-[#5C636A]
                whitespace-pre-line
                break-keep
              "
            >
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="바텀시트 닫기"
          className="
            flex shrink-0
            items-center justify-center
            w-7 h-7
            text-gray-900
            cursor-pointer
          "
        >
          <img
            src={x}
            alt=""
            className="
            w-3 h-3
          "
          />
        </button>
      </div>
    </div>
  );
};

export default BottomSheetHeader;
