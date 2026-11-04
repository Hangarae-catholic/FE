import { matchPath, Outlet } from 'react-router-dom';
import NavBar from '../components/common/NavBar';
// import TopBar from '../components/common/TopBar';
import HomeTopBar from '../components/HomePage/TopBar';

function MainLayout() {
  const isHome = !!matchPath({ path: '/home' }, location.pathname);
  const isTeamMatchingIndexPage = !!matchPath({ path: '/team-match' }, location.pathname);
  const isTeamMatchingDetailPage = !!matchPath({ path: '/team-match/:postId' }, location.pathname);

  const showNavBar = isHome || isTeamMatchingIndexPage;

  return (
    <div className={`flex flex-1 flex-col min-h-screen bg-gray-100`}>
      <div className='flex mx-auto min-h-screen w-full max-w-120 bg-bg'>
        <div className={`mx-auto flex w-full max-w-120 flex-col h-full ${isTeamMatchingDetailPage ? '' : 'px-5'}`}>
          {isHome && <HomeTopBar />}
          <main className={`flex flex-1 flex-col ${isTeamMatchingIndexPage ? 'mt-2.5' : 'mt-15'}`}>
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
