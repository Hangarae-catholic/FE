import { matchPath, Outlet } from 'react-router-dom';
import TopBar from '../components/HomePage/TopBar';
import NavBar from '../components/common/NavBar';

function MainLayout() {
  const isHome = !!matchPath({ path: '/home' }, location.pathname);

  const showNavBar = isHome;

  return (
    <div className={`flex flex-1 flex-col min-h-screen bg-gray-100`}>
      <div className='flex mx-auto min-h-screen w-full max-w-120 bg-bg'>
        <div className={`mx-auto flex w-full max-w-120 flex-col px-5 h-full`}>
          {isHome && <TopBar />}
          <main className='mt-15 flex flex-1 flex-col'>
            <Outlet />
          </main>
          {showNavBar && (
            <div className='mt-25'>
              <NavBar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default MainLayout;
