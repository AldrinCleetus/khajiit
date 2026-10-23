import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '../components/Header';
import { CategoryNav } from '../components/CategoryNav';

export const Route = createRootRoute({
  component: () => (
    <div className="app-layout flex flex-col min-h-screen">
      {/* Pinned top navigation: Header strictly at top: 0, CategoryNav directly below it */}
      <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md shadow-sm">
        <Header />
        <CategoryNav />
      </div>
      <main className="container main-content flex-1 py-6">
        <Outlet />
      </main>
    </div>
  ),
});
