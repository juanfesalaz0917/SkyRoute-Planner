import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/Layout'
import './App.css'

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-primary-blue dark:text-primary-light mb-4">
                  Dashboard
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Dashboard content coming soon...
                </p>
              </div>
            }
          />
          <Route
            path="/graph-viewer"
            element={
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-primary-blue dark:text-primary-light mb-4">
                  Graph Visualization
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Graph visualization content coming soon...
                </p>
              </div>
            }
          />
          <Route
            path="/planner"
            element={
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-primary-blue dark:text-primary-light mb-4">
                  Basic Planner
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Planner content coming soon...
                </p>
              </div>
            }
          />
          <Route
            path="/advanced-trip"
            element={
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-primary-blue dark:text-primary-light mb-4">
                  Advanced Trip
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Advanced trip planning content coming soon...
                </p>
              </div>
            }
          />
          <Route
            path="/interruption-handler"
            element={
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-primary-blue dark:text-primary-light mb-4">
                  Interruption Handler
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Interruption handling content coming soon...
                </p>
              </div>
            }
          />
          <Route
            path="/reports"
            element={
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-primary-blue dark:text-primary-light mb-4">
                  Reports
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Reports content coming soon...
                </p>
              </div>
            }
          />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
