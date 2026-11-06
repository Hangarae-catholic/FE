import { useState } from "react";
import type { ReactNode } from "react";
import magnifier from "../../../assets/icons/magnifier.svg";

interface BottomSheetContentProps {
  options?: string[];
  selected?: string[];
  onChange?: (values: string[]) => void;
  onClose: () => void;

  multiple?: boolean;
  maxSelections?: number;

  searchable?: boolean;
  searchPlaceholder?: string;

  columns?: 1 | 2;
  children?: ReactNode;
}

const BottomSheetContent = ({
  options = [],
  selected = [],
  onChange,
  onClose,
  multiple = false,
  maxSelections,
  searchable = false,
  searchPlaceholder = "검색해주세요",
  columns = 1,
  children,
}: BottomSheetContentProps) => {
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const handleSelect = (option: string) => {
    if (!onChange) return;

    // 단일 선택
    if (!multiple) {
      onChange([option]);
      onClose();
      return;
    }

    // 이미 선택된 항목이면 해제
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
      return;
    }

    // 최대 선택 개수 제한
    if (maxSelections !== undefined && selected.length >= maxSelections) {
      return;
    }

    onChange([...selected, option]);
  };

  return (
    <div className="flex flex-col gap-4">
      {searchable && (
        <div
          className="
            flex items-center gap-3
            w-full h-[52px]
            px-5
            rounded-[12px]
            bg-[#E9ECEF]
          "
        >
          <img
            src={magnifier}
            alt=""
            className="
            w-6 h-6
          "
          />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="
              w-full min-w-0
              bg-transparent
              text-[16px]
              font-normal
              text-gray-900
              placeholder:text-[#868E96]
              outline-none
            "
          />
        </div>
      )}

      {options.length > 0 && (
        <div
          className={
            columns === 2 ? "grid grid-cols-2 gap-x-2 gap-y-2" : "flex flex-col"
          }
        >
          {filteredOptions.map((option) => {
            const isSelected = selected.includes(option);

            const isDisabled =
              multiple &&
              maxSelections !== undefined &&
              selected.length >= maxSelections &&
              !isSelected;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                className="
                  flex items-center gap-3
                  w-full min-h-[46px]
                  py-2
                  text-left
                  cursor-pointer
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                <span
                  className={`
                    flex shrink-0
                    items-center justify-center
                    w-6 h-6
                    rounded-full
                    border-2
                    ${
                      isSelected
                        ? "bg-main border-main"
                        : "bg-white border-[#CED4DA]"
                    }
                  `}
                >
                  {isSelected && (
                    <span
                      className="
                        w-3 h-3
                        rounded-full bg-white
                      "
                    />
                  )}
                </span>

                <span
                  className="
                    text-[16px]
                    font-normal
                    text-[#343A40]
                    break-keep
                  "
                >
                  {option}
                </span>
              </button>
            );
          })}

          {filteredOptions.length === 0 && (
            <p
              className="
                col-span-full
                py-8 text-center
                text-[14px]
                text-gray-600
              "
            >
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default BottomSheetContent;
