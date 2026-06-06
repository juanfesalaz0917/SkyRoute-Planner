import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'

export interface NavbarProps {
  onToggleSidebar?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [isThemeDark, setIsThemeDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setIsThemeDark(!isThemeDark)
    document.documentElement.classList.toggle('dark')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-neutral-900 shadow-navbar border-b border-neutral-200 dark:border-neutral-800">
      <div className="px-4 h-navbar-height flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <FiMenu size={20} className="text-neutral-700 dark:text-neutral-300" />
          </button>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <FiX size={20} className="text-neutral-700 dark:text-neutral-300" />
            ) : (
              <FiMenu size={20} className="text-neutral-700 dark:text-neutral-300" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-blue to-secondary-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">✈</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-primary-blue dark:text-primary-light">
                SkyRoute
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Planner</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-blue dark:hover:text-primary-light transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/graph-viewer"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-blue dark:hover:text-primary-light transition-colors"
          >
            Graph Viewer
          </Link>
          <Link
            to="/planner"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-blue dark:hover:text-primary-light transition-colors"
          >
            Planner
          </Link>
          <Link
            to="/reports"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-blue dark:hover:text-primary-light transition-colors"
          >
            Reports
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isThemeDark ? (
              <FiSun size={20} className="text-yellow-500" />
            ) : (
              <FiMoon size={20} className="text-neutral-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2 animate-slide-in">
          <Link
            to="/dashboard"
            className="block px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/graph-viewer"
            className="block px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
          >
            Graph Viewer
          </Link>
          <Link
            to="/planner"
            className="block px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
          >
            Planner
          </Link>
          <Link
            to="/reports"
            className="block px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
          >
            Reports
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
