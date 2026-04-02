import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Feeds', to: '/feeds' },
  { label: 'Articles', to: '/articles' },
]

export default function Sidebar({ isOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false)

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
      isActive
        ? 'bg-white/10 text-white shadow-[0_20px_50px_-20px_rgba(59,130,246,0.6)]'
        : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`

  return (
    <>
      <aside
        className={`hidden lg:flex lg:h-screen lg:flex-col lg:overflow-hidden lg:border-r lg:border-white/10 lg:bg-[#111827]/40 lg:backdrop-blur-xl lg:px-4 lg:py-6 ${collapsed ? 'lg:w-24' : 'lg:w-72'}`}
      >
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]" />
            {!collapsed && <span className="text-sm font-semibold tracking-wider text-slate-100">FeedForge</span>}
          </div>
          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((prev) => !prev)}
            className="rounded-lg bg-white/10 px-2 py-1 text-xs text-slate-300 transition hover:bg-white/20"
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        <p className={`mt-4 text-xs leading-5 text-slate-400 ${collapsed ? 'hidden' : 'block'}`}>
          Premium RSS workspace, fast AI insights.
        </p>

        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={(props) => linkClass(props)}
              end
            >
              {({ isActive }) => (
                <>
                  {isActive && !collapsed && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-gradient-to-b from-[#3B82F6] to-[#8B5CF6]"
                    />
                  )}
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-200">
                    {item.icon ?? item.label[0]}
                  </span>
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
            <p className="text-slate-200 font-semibold">AI-powered insights</p>
            <p className="mt-1 leading-5">Streamline feed curation and stay ahead in an elegant workspace.</p>
          </div>
        )}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/70"
              onClick={onClose}
              aria-label="Close sidebar"
            />
            <motion.div
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col gap-6 overflow-hidden bg-[#0F172A] px-5 py-8 shadow-2xl"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-3 text-sm font-semibold tracking-[0.2em] text-slate-100">
                  <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
                  FeedForge
                </div>
                <button type="button" className="text-slate-300" onClick={onClose}>
                  Close
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} onClick={onClose} className={linkClass}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
