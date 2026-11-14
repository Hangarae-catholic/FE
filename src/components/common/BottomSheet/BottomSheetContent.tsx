import { useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import magnifier from '../../../assets/icons/magnifier.svg';

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

  hasInput?: boolean;
  bottomInputValue?: string;
  bottomInputChange?: Dispatch<SetStateAction<string>>;
  bottomFixed?: boolean;
  hasSubmit?: boolean;
}

const BottomSheetContent = ({ options = [], selected = [], onChange, onClose, multiple = false, maxSelections, searchable = false, searchPlaceholder = '검색해주세요', columns = 1, children, hasInput = false, bottomInputValue, bottomInputChange, bottomFixed, hasSubmit = false }: BottomSheetContentProps) => {
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter((option) => option.toLowerCase().includes(search.trim().toLowerCase()));

  const handleSelect = (option: string) => {
    if (!onChange) return;

    // 단일 선택
    if (!multiple) {
      onChange([option]);

      if (!hasSubmit) {
        onClose();
      }

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
    <div className='flex flex-col gap-4'>
      {searchable && (
        <div
          className='
            flex items-center gap-3
            w-full h-[52px]
            px-5
            rounded-[12px]
            bg-[#E9ECEF]
          '
        >
          <img
            src={magnifier}
            alt=''
            className='
            w-6 h-6
          '
          />

          <input
            type='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className='
              w-full min-w-0
              bg-transparent
              text-[16px]
              font-normal
              text-gray-900
              placeholder:text-[#868E96]
              outline-none
            '
          />
        </div>
      )}

      {options.length > 0 && (
        <div className={`${columns === 2 ? 'grid grid-cols-2 gap-x-2 gap-y-2' : 'flex flex-col'} ${bottomFixed ? 'mb-45' : ''}`}>
          {filteredOptions.map((option) => {
            const isSelected = selected.includes(option);

            const isDisabled = multiple && maxSelections !== undefined && selected.length >= maxSelections && !isSelected;

            return (
              <div key={option}>
                <button
                  type='button'
                  onClick={() => handleSelect(option)}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  className='
                    flex items-center gap-3
                    w-full min-h-[46px]
                    py-2
                    text-left
                    cursor-pointer
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  '
                >
                  <span
                    className={`
                      flex shrink-0
                      items-center justify-center
                      w-6 h-6
                      rounded-full
                      border-2
                      ${isSelected ? 'bg-main border-main' : 'bg-white border-[#CED4DA]'}
                    `}
                  >
                    {isSelected && (
                      <span
                        className='
                          w-3 h-3
                          rounded-full bg-white
                        '
                      />
                    )}
                  </span>

                  <span
                    className='
                      text-[16px]
                      font-normal
                      text-[#343A40]
                      break-keep
                    '
                  >
                    {option}
                  </span>
                </button>
              </div>
            );
          })}

          {filteredOptions.length === 0 && (
            <p
              className='
                col-span-full
                py-8 text-center
                text-[14px]
                text-gray-600
              '
            >
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      )}

      <div className={`${bottomFixed ? 'fixed bottom-0 left-0 right-0 mx-auto z-30 px-5 bg-linear-to-t from-[#F8F9FAE3] to-white py-4' : ''}`}>
        {hasInput && (
          <div className='flex flex-col w-full gap-1.5'>
            <span className='font-pretendard font-normal text-sm text-gray-800'>상세 주소</span>
            <input type='text' placeholder='예) 202호, 야외 무대 앞' className='px-3 py-2 bg-white border border-gray-300 rounded-lg font-pretendard font-normal text-base placeholder:text-gray-600 text-gray-800' value={bottomInputValue} onChange={(event) => bottomInputChange?.(event.target.value)} />
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default BottomSheetContent;
