import { useEffect, useId } from "react";
import type { ReactNode } from "react";

import BottomSheetHeader from "./BottomSheetHeader";
import BottomSheetContent from "./BottomSheetContent";
import useBottomSheet from "../../../hooks/useBottomSheet";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;

  title: string;
  description?: string;

  options?: string[];
  selected?: string[];
  onChange?: (values: string[]) => void;

  multiple?: boolean;
  maxSelections?: number;

  searchable?: boolean;
  searchPlaceholder?: string;

  columns?: 1 | 2;

  children?: ReactNode;
  footer?: ReactNode;
}

const BottomSheet = ({
  isOpen,
  onClose,
  title,
  description,
  options = [],
  selected = [],
  onChange,
  multiple = false,
  maxSelections,
  searchable = false,
  searchPlaceholder = "검색해주세요",
  columns = 1,
  children,
  footer,
}: BottomSheetProps) => {
  const titleId = useId();

  const { sheet, content } = useBottomSheet();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-end justify-center
      "
    >
      <div
        className="
          absolute inset-0
          bg-gray-900/25
        "
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="
          fixed
          left-1/2 -translate-x-1/2
          z-[101]
          flex flex-col
          w-full max-w-120
          rounded-t-[32px]
          bg-bg
          font-pretendard
          shadow-xl
          overflow-hidden
        "
      >
        <BottomSheetHeader
          title={title}
          description={description}
          onClose={onClose}
          titleId={titleId}
        />

        <div
          ref={content}
          className="
            flex-1 min-h-0
            overflow-y-auto
            overscroll-contain
            px-5 pt-4
            pb-[calc(24px+env(safe-area-inset-bottom,0px))]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <BottomSheetContent
            options={options}
            selected={selected}
            onChange={onChange}
            onClose={onClose}
            multiple={multiple}
            maxSelections={maxSelections}
            searchable={searchable}
            searchPlaceholder={searchPlaceholder}
            columns={columns}
          >
            {children}
          </BottomSheetContent>
        </div>

        {/* 선택형 버튼이 필요한 경우 */}
        {footer && (
          <div
            className="
              shrink-0
              bg-bg
              px-5 pt-3
              pb-[calc(20px+env(safe-area-inset-bottom,0px))]
            "
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomSheet;
