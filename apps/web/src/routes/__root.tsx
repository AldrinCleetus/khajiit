import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { CategoryNav } from '../components/CategoryNav'

export const Route = createRootRoute({
  component: () => (
    <div className="app-layout">
      <Header />
      <CategoryNav />
      <main className="container main-content" style={{ padding: 'var(--spacing-6) var(--spacing-4)' }}>
        <Outlet />
      </main>
    </div>
  ),
})
