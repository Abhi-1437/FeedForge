import { useEffect, useState } from 'react'
import { getFeeds, addFeed, deleteFeed } from '../services/api'
import FeedCard from '../components/FeedCard'
import Loader from '../components/Loader'

export default function Feeds() {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [error, setError] = useState(null)

  const loadFeeds = () => {
    setLoading(true)
    getFeeds()
      .then((res) => setFeeds(res.data || []))
      .catch((e) => setError(e.response?.data?.msg || e.message || 'Failed to load feeds'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadFeeds()
  }, [])

  const handleAdd = () => {
    if (!url.trim()) return
    setError(null)

    addFeed({ url: url.trim() })
      .then((res) => {
        setFeeds((prev) => [res.data, ...prev])
        setUrl('')
      })
      .catch((e) => setError(e.response?.data?.msg || e.message || 'Failed to add feed'))
  }

  const handleDelete = (id) => {
    deleteFeed(id)
      .then(() => setFeeds((prev) => prev.filter((f) => f.id !== id && f._id !== id)))
      .catch((e) => setError(e.response?.data?.msg || e.message || 'Failed to delete feed'))
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-4">
      <div className="glass-card rounded-[32px] border border-white/10 bg-[#0E152F]/50 p-8 shadow-glow">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Feeds</h1>
            <p className="mt-2 text-slate-300">Add new RSS sources and manage your feed collection in one central workspace.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Paste RSS feed URL"
            className="rounded-3xl border border-white/15 bg-[#0F172A] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="btn-glow rounded-3xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Add Feed
          </button>
        </div>

        {error && <div className="mt-4 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
      </div>

      {loading ? (
        <Loader message="Fetching feeds..." />
      ) : feeds.length === 0 ? (
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-slate-300">No feeds added yet. Start by adding a feed URL above.</div>
      ) : (
        <div className="grid gap-4">
          {feeds.map((feed) => (
            <FeedCard key={feed.id || feed._id} feed={feed} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
