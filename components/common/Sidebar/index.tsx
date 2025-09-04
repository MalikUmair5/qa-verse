import React from 'react'

function Sidebar() {
  return (
    <aside className="bg-background border-r border-gray-200 w-64 min-h-screen">
      <div className="p-4">
        {/* Sidebar Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <div className="mb-4">
            <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
              Main
            </h3>
            <ul className="space-y-1">
              <li>
                <a 
                  href="#" 
                  className="flex items-center px-3 py-2 text-foreground bg-secondary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center px-3 py-2 text-muted rounded-md hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <span>Projects</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center px-3 py-2 text-muted rounded-md hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <span>Test Cases</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
              Reports
            </h3>
            <ul className="space-y-1">
              <li>
                <a 
                  href="#" 
                  className="flex items-center px-3 py-2 text-muted rounded-md hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <span>Analytics</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center px-3 py-2 text-muted rounded-md hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <span>Test Results</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center px-3 py-2 text-muted rounded-md hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <span>Performance</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
              Settings
            </h3>
            <ul className="space-y-1">
              <li>
                <a 
                  href="#" 
                  className="flex items-center px-3 py-2 text-muted rounded-md hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <span>Profile</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center px-3 py-2 text-muted rounded-md hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <span>Preferences</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
