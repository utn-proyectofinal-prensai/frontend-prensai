import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';

import DashboardPage from '../pages/DashboardPage';
import UploadNewsPage from '../pages/UploadNewsPage';
import HistoryPage from '../pages/HistoryPage';
import AdminPage from '../pages/AdminPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import CreateClippingPage from '../pages/CreateClippingPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'upload-news',
        element: (
          <ProtectedRoute>
            <UploadNewsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin-users',
        element: <AdminUsersPage />,
      },
      {
        path: 'create-clipping',
        element: (
          <ProtectedRoute>
            <CreateClippingPage />
          </ProtectedRoute>
        ),
      }
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);