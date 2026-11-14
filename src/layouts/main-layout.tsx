import { matchPath, Outlet, useLocation } from 'react-router-dom';
import NavBar from '../components/common/NavBar';
// import TopBar from '../components/common/TopBar';
import HomeTopBar from '../components/HomePage/TopBar';

function MainLayout() {
  const location = useLocation();
  const isHome = !!matchPath({ path: '/home' }, location.pathname);
  const isTeamMatchingIndexPage = !!matchPath({ path: '/team-match' }, location.pathname);
  const isTeamMatchingDetailPage = !!matchPath({ path: '/team-match/:postId' }, location.pathname);
  const isEventDetailPage = !!matchPath({ path: '/event-detail/:postId' }, location.pathname);
  const isEventsPage = !!matchPath({ path: '/events' }, location.pathname);

  const showNavBar = isHome || isTeamMatchingIndexPage;

  return (
    <div className={`flex flex-1 flex-col min-h-screen bg-gray-100`}>
      <div className={`flex mx-auto min-h-screen w-full max-w-120 ${isHome ? 'bg-main-gradient' : 'bg-bg'}`}>
        <div className={`mx-auto flex w-full max-w-120 flex-col h-full ${isTeamMatchingDetailPage || isEventDetailPage || isEventsPage ? '' : 'px-5'}`}>
          {isHome && <HomeTopBar />}
          <main className={`flex flex-1 flex-col ${isTeamMatchingIndexPage ? 'mt-2.5' : isEventsPage ? 'mt-10' : 'mt-15'}`}>
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
