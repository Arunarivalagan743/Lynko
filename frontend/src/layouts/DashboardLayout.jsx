import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar.jsx'
import MobileSidebar from '../components/layout/MobileSidebar.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import clsx from 'clsx'

export default function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Auto-collapse sidebar on tablet viewports on mount or screen resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 768 && width < 1024) {
        setIsSidebarCollapsed(true)
      } else if (width >= 1024) {
        setIsSidebarCollapsed(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Sidebars toggle operations
  const openMobileSidebar = () => setIsMobileSidebarOpen(true)
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false)

  return (
    <div className="min-h-screen bg-background text-text">
      {/* 1. Desktop Fixed Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)} />

      {/* 2. Mobile Drawer Sidebar (with backdrop overlays) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <MobileSidebar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />
        )}
      </AnimatePresence>

      {/* 3. Main Workspace Container Area (offset by desktop sidebar width) */}
      <div className={clsx(
        'flex flex-col min-h-screen transition-all duration-150 ease-in-out',
        isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'
      )}>
        {/* Sticky Header Nav */}
        <Header onMenuToggle={openMobileSidebar} />

        {/* Scrollable Workspaces Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
          <PageContainer>
            {/* Renders lazy-loaded layout children routes */}
            <Outlet />
          </PageContainer>
        </main>
      </div>
    </div>
  )
}
export { DashboardLayout }
