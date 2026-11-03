import { useNavigate } from 'react-router-dom';
import LeftArrow from '/src/assets/icons/arrow_left.svg?react';

interface TopBarProps {
  title?: string;
  rightIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  rightBtnName?: string;
  leftOnClick?: () => void;
  rightOnClick?: () => void;
}

export default function TopBar({ title, rightIcon, rightBtnName, leftOnClick, rightOnClick }: TopBarProps) {
  const RightIcon = rightIcon;
  const navigate = useNavigate();

  return (
    <div className='fixed top-0 z-30 flex w-full h-11 left-1/2 -translate-x-1/2 max-w-120 items-center justify-center bg-bg py-2.5 px-5'>
      <button type='button' className='fixed left-5' onClick={leftOnClick ? leftOnClick : () => navigate(-1)}>
        <LeftArrow className='w-8 h-8 text-gray-700' />
      </button>
      {title && <h1 className='font-pretendard font-medium text-base leading-6 text-gray-800'>{title}</h1>}
      {RightIcon && (
        <button type='button' className={`fixed right-5 flex items-center gap-0.5 ${rightBtnName && 'bg-gray-100 rounded-xl py-0.5 px-1.5'}`} onClick={rightOnClick}>
          <RightIcon className='w-6 h-6 text-gray-700' />
          {rightBtnName && <span className='font-pretendard font-normal text-sm text-gray-800'>{rightBtnName}</span>}
        </button>
      )}
    </div>
  );
}
