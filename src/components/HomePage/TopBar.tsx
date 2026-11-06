import Logo from '/src/assets/icons/logo_nonbg.svg';
import TextLogo from '/src/assets/icons/logo_text.svg';
import Bell from '/src/assets/icons/bell.svg?react';
// import { useState } from 'react';

export default function TopBar() {
  // const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  return (
    <div className='fixed top-0 z-30 flex w-full left-1/2 -translate-x-1/2 max-w-120 items-center justify-between py-2.5 px-5 bg-main'>
      <div className='flex items-center gap-1'>
        <img src={Logo} alt='logo' />
        <img src={TextLogo} alt='Hangarae' className='h-6 w-18' />
      </div>

      <button type='button' className='p-1'>
        <Bell className='w-7 h-7 text-orange-50' />
        {/* {hasUnreadNotifications && <div className='w-1.5 h-1.5 rounded-full bg-orange-50 absolute top-4 right-7.5'></div>} */}
      </button>
    </div>
  );
}
