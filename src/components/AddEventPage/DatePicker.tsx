import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import ArrowLeft from '/src/assets/icons/date-arrow_left.svg?react';
import ArrowRight from '/src/assets/icons/date-arrow_right.svg?react';
import ArrowDown from '/src/assets/icons/arrow_down.svg?react';

type DateButtonProps = {
  value?: string;
  onClick?: () => void;
  isDateSelected?: boolean;
};

const DateButton = forwardRef<HTMLButtonElement, DateButtonProps>(({ value, onClick, isDateSelected = false }, ref) => (
  <button ref={ref} type='button' onClick={onClick} aria-label='행사 날짜 선택' className='flex items-center gap-0.5'>
    <span className={`font-pretendard font-medium text-sm underline ${isDateSelected ? 'text-main' : 'text-gray-500'}`}>{value}</span>
    <ArrowDown className='w-6 h-6 text-gray-700' />
  </button>
));

DateButton.displayName = 'DateButton';

type DateDropdownProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  isDateSelected: boolean;
};

export default function DateDropdown({ value, onChange, isDateSelected }: DateDropdownProps) {
  return (
    <>
      <DatePicker
        selected={value}
        onChange={onChange}
        locale={ko}
        dateFormat='yyyy.MM.dd'
        customInput={<DateButton isDateSelected={isDateSelected} />}
        popperClassName='!z-50'
        popperPlacement='bottom'
        showPopperArrow={false}
        shouldCloseOnSelect
        isClearable={false}
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
          <div className='flex items-center justify-between px-3 pb-3 pt-1'>
            <button type='button' onClick={decreaseMonth} aria-label='이전 달' className='flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100'>
              <ArrowLeft className='w-8 h-8' />
            </button>

            <span className='font-pretendard text-base font-semibold text-gray-800'>
              {date.getMonth() + 1}월 {date.getFullYear()}
            </span>

            <button type='button' onClick={increaseMonth} aria-label='다음 달' className='flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100'>
              <ArrowRight className='w-8 h-8' />
            </button>
          </div>
        )}
      />
    </>
  );
}
