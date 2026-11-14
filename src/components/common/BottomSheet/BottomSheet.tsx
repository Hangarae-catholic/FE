import { useEffect, useId } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

import BottomSheetHeader from './BottomSheetHeader';
import BottomSheetContent from './BottomSheetContent';
import useBottomSheet from '../../../hooks/useBottomSheet';

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

  initialHeight?: number;

  hasInput?: boolean;
  bottomInputChange?: Dispatch<SetStateAction<string>>;
  bottomInputValue?: string;
  bottomFixed?: boolean;
  hasSubmit?: boolean;
}

// 실제로 바텀시트가 열렸을 때만 마운트되는 컴포넌트
const BottomSheetPanel = ({ onClose, title, description, options = [], selected = [], onChange, multiple = false, maxSelections, searchable = false, searchPlaceholder = '검색해주세요', columns = 1, children, footer, initialHeight = 0.5, hasInput = false, bottomInputChange, bottomInputValue, bottomFixed, hasSubmit = false }: BottomSheetProps) => {
  const titleId = useId();

  const { sheet, handle, content } = useBottomSheet(initialHeight);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className='
        fixed inset-0 z-[100]
        flex items-end justify-center
      '
    >
      <div
        className='
          absolute inset-0
          bg-gray-900/25
        '
        onClick={onClose}
        aria-hidden='true'
      />

      <div
        ref={sheet}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className='
          fixed left-1/2 -translate-x-1/2
          z-[101]
          flex flex-col
          w-full max-w-120
          min-h-0
          rounded-t-[32px]
          bg-[#F8F9FA] font-pretendard
          shadow-xl
          overflow-hidden
        '
        style={{
          top: `${(1 - initialHeight) * 100}dvh`,
          height: `${initialHeight * 100}dvh`,
        }}
      >
        <BottomSheetHeader title={title} description={description} onClose={onClose} titleId={titleId} handleRef={handle} />

        <div
          ref={content}
          className='
            flex-1 min-h-0
            overflow-y-auto
            overscroll-contain
            px-5 pt-4
            pb-[calc(24px+env(safe-area-inset-bottom,0px))]
            [&::-webkit-scrollbar]:hidden
          '
        >
          <BottomSheetContent options={options} selected={selected} onChange={onChange} onClose={onClose} multiple={multiple} maxSelections={maxSelections} searchable={searchable} searchPlaceholder={searchPlaceholder} columns={columns} hasInput={hasInput} bottomInputChange={bottomInputChange} bottomInputValue={bottomInputValue} bottomFixed={bottomFixed} hasSubmit={hasSubmit}>
            {children}
          </BottomSheetContent>
        </div>

        {footer && (
          <div
            className='
              shrink-0
              bg-bg
              px-5 pt-3
              pb-[calc(20px+env(safe-area-inset-bottom,0px))]
            '
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const BottomSheet = (props: BottomSheetProps) => {
  if (!props.isOpen) return null;

  return <BottomSheetPanel {...props} />;
};

export default BottomSheet;
