import Logo from '/src/assets/icons/logo_nonbg.svg';
import TextLogo from '/src/assets/icons/logo_text.svg';
import Bell from '/src/assets/icons/bell.svg';
import { useState } from 'react';

export default function TopBar() {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  return (
    <div className='flex justify-between items-center py-2.5'>
      <div className='flex items-center gap-1'>
        <img src={Logo} alt='logo' />
        <img src={TextLogo} alt='Hangarae' className='w-18 h-6' />
      </div>
      <button type='button' className='p-1'>
        <img src={Bell} alt='notice' className='relative w-7 h-7' />
        {hasUnreadNotifications && <div className='w-1.5 h-1.5 rounded-full bg-main absolute top-4 right-29'></div>}
      </button>
    </div>
  );
}
