import CapyCheerUp from '/src/assets/images/capy_cheer_up.svg?react';
import CapyGreeting from '/src/assets/images/capy_greeting.svg?react';
import CapyThumbsUp from '/src/assets/images/capy_thumbs_up.svg?react';
import CapyV from '/src/assets/images/capy_v.svg?react';
import CapyMatchHand from '/src/assets/images/capy_match_hand.svg?react';

const CHARACTERS = [CapyCheerUp, CapyGreeting, CapyThumbsUp, CapyV, CapyMatchHand];

const LoadingSpinner = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-main'>
      <div className='flex items-end gap-[5px]'>
        {CHARACTERS.map((Character, index) => {
          const delays = [0, 200, 400, 600, 800];

          return (
            <div key={index} className='flex h-[70px] w-[57px] items-center justify-center'>
              <Character
                className='h-[57px] w-[57px] object-contain animate-[loading-jump_1.3s_ease-in-out_infinite]'
                style={{
                  animationDelay: `${delays[index]}ms`,
                }}
              />
            </div>
          );
        })}
      </div>

      <p className='mt-[25px] text-[22px] font-semibold tracking-normal text-gray-400'>LOADING...</p>
    </div>
  );
};

export default LoadingSpinner;
