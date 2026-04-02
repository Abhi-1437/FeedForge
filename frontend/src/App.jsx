import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Feeds from './pages/Feeds'
import Articles from './pages/Articles'
import Login from './pages/Login'
import Register from './pages/Register'

const authPaths = ['/', '/register', '/login']

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const isAuthRoute = authPaths.includes(location.pathname)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(59,130,246,0.2),transparent_25%),radial-gradient(circle_at_90%_20%,rgba(139,92,246,0.16),transparent_30%),linear-gradient(180deg,#0F172A_0%,#020617_100%)] text-slate-100">
      <div className="relative lg:flex">
        {!isAuthRoute && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
        <div className={isAuthRoute ? 'min-h-screen flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8' : 'flex-1 lg:pl-72'}>
          {!isAuthRoute && <Navbar onToggleSidebar={() => setSidebarOpen(true)} />}

          <main className={isAuthRoute ? 'w-full max-w-xl mx-auto' : 'min-h-[calc(100vh-72px)] px-4 pb-10 pt-6 sm:px-6 lg:px-8'}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <Routes location={location}>
                  <Route path="/" element={<Register />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/feeds" element={<Feeds />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<Register />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
