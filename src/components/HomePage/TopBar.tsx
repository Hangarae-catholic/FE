import Logo from '/src/assets/icons/logo_nonbg.svg';
import TextLogo from '/src/assets/icons/logo_text.svg';
import Bell from '/src/assets/icons/bell.svg';

export default function TopBar() {
  // const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  return (
    <div className='fixed top-0 z-50 flex w-full left-1/2 -translate-x-1/2 max-w-120 items-center justify-between bg-bg py-2.5 px-5'>
      <div className='flex items-center gap-1'>
        <img src={Logo} alt='logo' />
        <img src={TextLogo} alt='Hangarae' className='h-6 w-18' />
      </div>

      <button type='button' className='p-1'>
        <img src={Bell} alt='notice' className='h-7 w-7' />
        {/* {hasUnreadNotifications && <div className='w-1.5 h-1.5 rounded-full bg-main absolute top-4 right-29'></div>} */}
      </button>
    </div>
  );
}
