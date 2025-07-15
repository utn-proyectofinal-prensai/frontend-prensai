import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <header>PrensAI</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;