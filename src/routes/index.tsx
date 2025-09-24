import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

import DashboardPage from '../pages/DashboardPage';
import UploadNewsPage from '../pages/UploadNewsPage';
import HistoryPage from '../pages/HistoryPage';
import SettingsPage from '../pages/SettingsPage';
import UsersPage from '../pages/UsersPage';
import AiConfigurationsPage from '../pages/AiConfigurationsPage';
import CreateClippingPage from '../pages/CreateClippingPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import { ProtectedRoute, AdminRoute } from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
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
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        ),
      },
      {
        path: 'ai-configurations',
        element: (
          <AdminRoute>
            <AiConfigurationsPage />
          </AdminRoute>
        ),
      },
      {
        path: 'create-clipping',
        element: (
          <ProtectedRoute>
            <CreateClippingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
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