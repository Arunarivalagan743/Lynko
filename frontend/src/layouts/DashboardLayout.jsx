import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar.jsx'
import MobileSidebar from '../components/layout/MobileSidebar.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'

export default function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Sidebars toggle operations
  const openMobileSidebar = () => setIsMobileSidebarOpen(true)
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false)

  return (
    <div className="min-h-screen bg-background text-text">
      {/* 1. Desktop Fixed Sidebar */}
      <Sidebar />

      {/* 2. Mobile Drawer Sidebar (with backdrop overlays) */}
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />

      {/* 3. Main Workspace Container Area (offset by desktop sidebar width) */}
      <div className="flex flex-col min-h-screen lg:pl-72">
        {/* Sticky Header Nav */}
        <Header onMenuToggle={openMobileSidebar} />

        {/* Scrollable Workspaces Area */}
        <main className="flex-1 overflow-y-auto">
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
