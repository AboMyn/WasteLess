import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Marketplace } from './pages/Marketplace';
import { MapView } from './pages/MapView';
import { ProductDetails } from './pages/ProductDetails';
import { Profile } from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: 'marketplace', Component: Marketplace },
      { path: 'map', Component: MapView },
      { path: 'product/:id', Component: ProductDetails },
      { path: 'profile', Component: Profile },
    ],
  },
]);
