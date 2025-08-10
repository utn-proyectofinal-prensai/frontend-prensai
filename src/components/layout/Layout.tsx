import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Mostrar nombre completo si está disponible
  const displayName = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user?.username || 'Usuario';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-900">PrensAI</h1>
            </div>
            
            {isAuthenticated && user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="block text-sm font-medium text-gray-700">
                    {displayName}
                  </span>
                  {user.email && (
                    <span className="block text-xs text-gray-500">
                      {user.email}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;