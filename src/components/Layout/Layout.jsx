import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import ErrorBoundary from '../ErrorBoundary'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F4F2EE]">
        <ErrorBoundary>
          <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        </ErrorBoundary>
        
        {/* Contenu principal qui se décale dynamiquement */}
        <div className={`transition-all duration-300 ease-out ${
          sidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}>
          <ErrorBoundary>
            <Header onMenuToggle={toggleSidebar} isSidebarOpen={sidebarOpen} />
          </ErrorBoundary>
          
          <main className="p-4 sm:p-6">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

