import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Marketplace } from './pages/Marketplace';
import { MapView } from './pages/MapView';
import { ProductDetails } from './pages/ProductDetails';
import { Profile } from './pages/Profile';

import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuth = localStorage.getItem('isAuth') === 'true';

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Landing },
      { path: 'marketplace', Component: Marketplace },
      { path: 'map', Component: MapView },
      { path: 'product/:id', Component: ProductDetails },
      { path: 'profile', Component: Profile },
    ],
  },
]);