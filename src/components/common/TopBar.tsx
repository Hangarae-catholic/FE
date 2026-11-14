import { useNavigate } from 'react-router-dom';
import LeftArrow from '/src/assets/icons/arrow_left.svg?react';
import RightArrow from '/src/assets/icons/arrow_right.svg?react';

interface TopBarProps {
  title?: string;
  rightIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  rightBtnName?: string;
  leftOnClick?: () => void;
  rightOnClick?: () => void;
  btnTextColor?: string;
  btnBgColor?: string;
  isMoreModalOpen?: boolean;
  onClickModalBtn1?: () => void;
  onClickModalBtn2?: () => void;
  modalBtn1?: string;
  modalBtn2?: string;
}

export default function TopBar({ title, rightIcon, rightBtnName, leftOnClick, rightOnClick, btnTextColor, btnBgColor, isMoreModalOpen, modalBtn1, modalBtn2, onClickModalBtn1, onClickModalBtn2 }: TopBarProps) {
  const RightIcon = rightIcon;
  const navigate = useNavigate();

  return (
    <div className='fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-120'>
      {/* 상단바 */}
      <div className='relative flex w-full h-11 items-center justify-center bg-bg py-2.5 px-5'>
        <button type='button' className='absolute left-5' onClick={leftOnClick ? leftOnClick : () => navigate(-1)}>
          <LeftArrow className='w-8 h-8 text-gray-700' />
        </button>

        {title && <h1 className='font-pretendard font-medium text-base leading-6 text-gray-800'>{title}</h1>}

        {RightIcon && (
          <button type='button' className={`absolute right-5 flex items-center gap-0.5 ${rightBtnName && 'bg-gray-100 rounded-xl py-0.5 px-1.5'}`} onClick={rightOnClick}>
            <RightIcon className='w-6 h-6 text-gray-700' />
            {rightBtnName && <span className='font-pretendard font-normal text-sm text-gray-800'>{rightBtnName}</span>}
          </button>
        )}

        {!RightIcon && rightBtnName && (
          <button
            type='button'
            className='absolute right-5 flex items-center gap-0.5 font-pretendard font-normal text-base rounded-2xl px-3 py-0.5'
            style={{
              color: btnTextColor,
              backgroundColor: btnBgColor,
            }}
            onClick={rightOnClick}
          >
            {rightBtnName}
          </button>
        )}
      </div>

      {/* 우측 더보기 버튼 모달창 */}
      {isMoreModalOpen && (
        <div className='absolute top-full right-2 mt-1 z-50 flex flex-col w-34 px-3 rounded-xl bg-[#fcfbfb] shadow-lg'>
          <button type='button' className='flex items-center justify-between py-2 border-b border-gray-200' onClick={onClickModalBtn1}>
            <span className='font-pretendard font-normal text-sm text-gray-800'>{modalBtn1}</span>
            <RightArrow className='w-2.5 h-2.5' />
          </button>

          <button type='button' className='flex items-center justify-between py-2' onClick={onClickModalBtn2}>
            <span className='font-pretendard font-normal text-sm text-gray-800'>{modalBtn2}</span>
            <RightArrow className='w-2.5 h-2.5' />
          </button>
        </div>
      )}
    </div>
  );
}
