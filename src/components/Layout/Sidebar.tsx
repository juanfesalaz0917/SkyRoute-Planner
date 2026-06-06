import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

interface SidebarItem {
  icon: string
  label: string
  href: string
}

const sidebarItems: SidebarItem[] = [
  { icon: '📊', label: 'Dashboard', href: '/dashboard' },
  { icon: '📈', label: 'Graph Visualization', href: '/graph-viewer' },
  { icon: '✈️', label: 'Basic Planner', href: '/planner' },
  { icon: '🚀', label: 'Advanced Trip', href: '/advanced-trip' },
  { icon: '⚡', label: 'Interruption Handler', href: '/interruption-handler' },
  { icon: '📋', label: 'Reports', href: '/reports' },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-navbar-height bottom-0 z-30
          transition-all duration-300 ease-in-out
          bg-white dark:bg-neutral-900
          border-r border-neutral-200 dark:border-neutral-800
          shadow-sidebar
          ${isCollapsed ? 'w-sidebar-width-collapsed' : 'w-sidebar-width'}
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          overflow-y-auto
        `}
      >
        {/* Collapse Toggle */}
        <div className="hidden lg:flex justify-end p-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <FiChevronRight size={20} className="text-neutral-700 dark:text-neutral-300" />
            ) : (
              <FiChevronLeft size={20} className="text-neutral-700 dark:text-neutral-300" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col p-2 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={handleLinkClick}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-md
                transition-all duration-200
                ${isActive(item.href)
                  ? 'bg-gradient-to-r from-primary-blue/10 to-secondary-orange/10 text-primary-blue dark:text-primary-light border-l-4 border-primary-blue dark:border-primary-light'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'}
              `}
            >
              <span className={`flex-shrink-0 text-lg ${isCollapsed ? '' : ''}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer Info */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              SkyRoute Planner v1.0
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              Ucaldas 2026-1
            </p>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
