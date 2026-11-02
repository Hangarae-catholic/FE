interface ModalProps {
  title: string;
  content?: string;
  leftBtn?: string;
  rightBtn: string;
  rightBtnColor?: 'ORANGE' | 'RED';
}

export default function Modal({ title, content, leftBtn, rightBtn, rightBtnColor = 'ORANGE' }: ModalProps) {
  return (
    <div role='dialog' aria-modal='true' className='fixed inset-0 flex items-center justify-center bg-gray-700/23 z-50 w-full max-w-120 left-1/2 -translate-x-1/2'>
      <div className='bg-white p-5 w-full max-w-80 rounded-[20px] flex flex-col gap-4'>
        <div className='flex- flex-col gap-1.5'>
          <h1 className='font-pretendard font-semibold text-lg text-gray-800 leading-7 break-keep'>{title}</h1>
          {content && <p className='font-pretendard font-normal text-base text-gray-700 leading-6 break-keep'>{content}</p>}
        </div>
        <div className='flex justify-center items-center gap-4'>
          {leftBtn && (
            <button type='button' className='w-full font-pretendard font-medium text-base text-gray-800 p-2.5 rounded-xl bg-gray-200'>
              {leftBtn}
            </button>
          )}
          <button type='button' className={`w-full font-pretendard font-medium text-base text-white p-2.5 rounded-xl ${rightBtnColor === 'ORANGE' ? 'bg-main' : 'bg-error'}`}>
            {rightBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
