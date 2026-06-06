import { Link } from 'react-router-dom'
import { FiGithub, FiMail, FiMapPin } from 'react-icons/fi'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 mt-auto">
      <div className="px-4 py-8 md:py-12">
        {/* Content Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                About SkyRoute
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                SkyRoute Planner is a graph-based route optimization system for efficient flight planning and interruption handling.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-blue dark:hover:text-primary-light transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/planner"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-blue dark:hover:text-primary-light transition-colors"
                  >
                    Planner
                  </Link>
                </li>
                <li>
                  <Link
                    to="/reports"
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-blue dark:hover:text-primary-light transition-colors"
                  >
                    Reports
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Contact
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <FiMapPin size={16} />
                  <span>Universidad de Caldas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <FiMail size={16} />
                  <a
                    href="mailto:info@ucaldas.edu.co"
                    className="hover:text-primary-blue dark:hover:text-primary-light transition-colors"
                  >
                    info@ucaldas.edu.co
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  &copy; {currentYear} SkyRoute Planner. All rights reserved.
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  Proyecto de Estructuras de Datos • Ucaldas 2026-1
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-primary-blue dark:hover:text-primary-light"
                  aria-label="GitHub"
                >
                  <FiGithub size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer Spacing */}
      <div className="h-4 md:h-0" />
    </footer>
  )
}

export default Footer
