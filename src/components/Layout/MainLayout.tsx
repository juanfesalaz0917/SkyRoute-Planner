import { useState } from 'react'
import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

export interface MainLayoutProps {
  children?: ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-1 pt-navbar-height">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main Content */}
        <main
          className={`
            flex-1 transition-all duration-300
            lg:ml-sidebar-width
            ${isSidebarOpen && window.innerWidth >= 1024 ? '' : ''}
          `}
        >
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {children || (
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Welcome to SkyRoute Planner
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Select a section from the sidebar to get started
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MainLayout
