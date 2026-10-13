import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className={`flex flex-1 flex-col min-h-screen bg-gray-100`}>
      <div className='flex mx-auto min-h-screen w-full max-w-120 bg-bg'>
        <div className={`mx-auto flex w-full max-w-120 flex-col`}>
          <main className='flex flex-1 flex-col'>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
export default MainLayout;
