import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Toaster } from './ui/sonner';

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
