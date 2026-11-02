import { useEffect, useRef, useState } from 'react';
import ArrowUp from '/src/assets/icons/time-arrow_up.svg?react';
import ArrowDown from '/src/assets/icons/time-arrow_down.svg?react';

interface StartTimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

const ITEM_HEIGHT = 44;

interface WheelColumnProps {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

const REPEAT_COUNT = 101;

interface WheelColumnProps {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

function WheelColumn({ label, value, max, onChange }: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAdjustingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const values = Array.from({ length: max + 1 }, (_, i) => i);

  // 가운데 반복 목록의 시작 위치
  const middleStart = Math.floor(REPEAT_COUNT / 2) * (max + 1);

  // 현재 선택된 숫자가 가운데 반복 목록에 오도록 초기 위치 설정
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = (middleStart + value) * ITEM_HEIGHT;
  }, [value, middleStart]);

  const scrollToIndex = (index: number, smooth = true) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: index * ITEM_HEIGHT,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || isAdjustingRef.current) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 스크롤 중에도 가장 가까운 숫자를 선택
    const index = Math.round(container.scrollTop / ITEM_HEIGHT);
    const nextValue = ((index % (max + 1)) + (max + 1)) % (max + 1);

    onChange(nextValue);

    // 스크롤이 멈추면 중앙 반복 영역으로 위치를 보정
    scrollTimeoutRef.current = setTimeout(() => {
      const currentContainer = containerRef.current;
      if (!currentContainer) return;

      const currentIndex = Math.round(currentContainer.scrollTop / ITEM_HEIGHT);

      const currentValue = ((currentIndex % (max + 1)) + (max + 1)) % (max + 1);

      const targetIndex = middleStart + currentValue;

      isAdjustingRef.current = true;
      currentContainer.scrollTop = targetIndex * ITEM_HEIGHT;

      requestAnimationFrame(() => {
        isAdjustingRef.current = false;
      });
    }, 120);
  };

  const changeBy = (amount: number) => {
    const container = containerRef.current;
    if (!container) return;

    const currentIndex = Math.round(container.scrollTop / ITEM_HEIGHT);
    scrollToIndex(currentIndex - amount);
  };

  return (
    <div className='flex w-20 flex-col items-center font-pretendard'>
      <button type='button' onClick={() => changeBy(1)} aria-label={`${label} 증가`} className='p-1'>
        <ArrowUp className='w-6 h-6' />
      </button>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className='my-1 h-11 w-full overflow-y-auto overscroll-contain snap-y snap-mandatory'
        style={{
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {Array.from({ length: REPEAT_COUNT }, (_, repeatIndex) =>
          values.map((n) => (
            <div key={`${repeatIndex}-${n}`} className={`flex h-11 w-full snap-center items-center justify-center text-2xl font-normal ${n === value ? 'text-gray-900' : 'text-gray-400'}`}>
              {String(n).padStart(2, '0')}
            </div>
          )),
        )}
      </div>

      <button type='button' onClick={() => changeBy(-1)} aria-label={`${label} 감소`} className='p-1'>
        <ArrowDown className='w-6 h-6' />
      </button>
    </div>
  );
}

export default function StartTimePicker({ value, onChange }: StartTimePickerProps) {
  const [initialHour, initialMinute] = value ? value.split(':').map(Number) : [9, 0];

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  const updateHour = (nextHour: number) => {
    setHour(nextHour);
    onChange(`${String(nextHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  };

  const updateMinute = (nextMinute: number) => {
    setMinute(nextMinute);
    onChange(`${String(hour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`);
  };

  return (
    <div className='flex w-full items-center justify-center gap-4'>
      <WheelColumn label='시' value={hour} max={23} onChange={updateHour} />

      <span className='text-2xl font-normal text-gray-900'>:</span>

      <WheelColumn label='분' value={minute} max={59} onChange={updateMinute} />
    </div>
  );
}
