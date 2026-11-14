import Logo from '/src/assets/icons/logo_nonbg.svg';
import TextLogo from '/src/assets/icons/logo_text.svg';

export default function TopBar() {
  return (
    <div className='fixed top-0 z-30 flex w-full left-1/2 -translate-x-1/2 max-w-120 items-center justify-between py-2.5 px-5 bg-main'>
      <div className='flex items-center gap-1'>
        <img src={Logo} alt='logo' />
        <img src={TextLogo} alt='Hangarae' className='h-6 w-18' />
      </div>
    </div>
  );
}
