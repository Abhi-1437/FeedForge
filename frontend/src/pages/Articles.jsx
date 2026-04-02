import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getArticles, searchArticles } from '../services/api'
import ArticleCard from '../components/ArticleCard'
import Loader from '../components/Loader'

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const currentQuery = searchParams.get('q') || ''

  useEffect(() => {
    setQuery(currentQuery)
    if (!currentQuery) {
      setSearchResults(null)
      setLoading(true)
      getArticles()
        .then((res) => setArticles((res.data || []).sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date))))
        .catch((e) => setError(e.response?.data?.msg || e.message || 'Failed to load articles'))
        .finally(() => setLoading(false))
      return
    }

    setSearching(true)
    setError(null)
    searchArticles(currentQuery)
      .then((res) => setSearchResults(res.data || []))
      .catch((e) => setError(e.response?.data?.msg || e.message || 'Search failed'))
      .finally(() => setSearching(false))
  }, [currentQuery])

  const handleSearch = () => {
    const trimmed = query.trim()
    if (trimmed) {
      setSearchParams({ q: trimmed })
    } else {
      setSearchParams({})
    }
  }

  const handleClear = () => {
    setQuery('')
    setSearchResults(null)
    setSearchParams({})
  }

  const displayedArticles = searchResults !== null ? searchResults : articles

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-4">
      <div className="glass-card rounded-[32px] border border-white/10 bg-[#0E152F]/50 p-8 shadow-glow">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Articles</h1>
            <p className="mt-2 text-slate-300">Explore everything from your RSS feeds and find relevant stories instantly.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
              placeholder="Search articles by keyword"
              className="min-w-[220px] rounded-3xl border border-white/15 bg-[#0F172A] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="btn-glow rounded-3xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              disabled={searching}
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-3xl bg-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/20"
            >
              Clear
            </button>
          </div>
        </div>

        {error && <div className="rounded-[32px] bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>}
      </div>

      {loading ? (
        <Loader message="Loading articles..." />
      ) : displayedArticles.length === 0 ? (
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-slate-300">No matching articles found.</div>
      ) : (
        <div className="grid gap-4">
          {displayedArticles.map((article) => (
            <ArticleCard key={article.id || article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
