import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar({ onToggleSidebar }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const onAuthChange = () => setToken(localStorage.getItem('token'))

    window.addEventListener('storage', onAuthChange)
    window.addEventListener('authChange', onAuthChange)

    return () => {
      window.removeEventListener('storage', onAuthChange)
      window.removeEventListener('authChange', onAuthChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    window.dispatchEvent(new Event('authChange'))
    navigate('/login')
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const term = search.trim()
    if (term) {
      navigate(`/articles?q=${encodeURIComponent(term)}`)
    } else {
      navigate('/articles')
    }
  }

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-7xl rounded-3xl border border-white/10 bg-[#0F172A]/30 p-3 backdrop-blur-xl drop-shadow-2xl">
      <div className="flex min-h-[70px] items-center justify-between gap-4 px-3 sm:px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/15 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">FeedForge</span>
            <span className="text-sm text-slate-300">AI-powered RSS</span>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 items-center gap-3 rounded-3xl border border-white/20 bg-white/10 px-3 py-2 shadow-glow"
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search articles..."
            className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 outline-none focus:shadow-glow"
          />
          <button
            type="submit"
            className="btn-glow rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-200">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-3xl bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                to="/login"
                className="rounded-3xl bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-3xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
