import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getArticles, getFeeds } from '../services/api'
import Card from '../components/Card'
import ArticleCard from '../components/ArticleCard'
import Loader from '../components/Loader'

const safeParse = (value) => {
  try {
    return JSON.parse(value || '[]')
  } catch {
    return []
  }
}

export default function Dashboard() {
  const [articles, setArticles] = useState([])
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getArticles(), getFeeds()])
      .then(([articlesRes, feedsRes]) => {
        const articlesList = (articlesRes.data || []).sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date))
        setArticles(articlesList)
        setFeeds(feedsRes.data || [])
      })
      .catch((err) => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const latestArticles = articles.slice(0, 4)
  const bookmarkCount = typeof window !== 'undefined' ? safeParse(localStorage.getItem('feedforge_bookmarked_articles')).length : 0

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]"
      >
        <div className="glass-card rounded-[32px] p-8 shadow-glow border border-white/10">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Welcome back</p>
            <h1 className="text-4xl font-extrabold text-white">FeedForge Dashboard</h1>
            <p className="max-w-2xl text-slate-300 leading-7">
              Monitor feed health, discover fresh articles, and generate AI summaries in a clean, futuristic workspace.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {[
            { title: 'Total feeds', value: feeds.length },
            { title: 'Total articles', value: articles.length },
            { title: 'Bookmarked', value: bookmarkCount },
          ].map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -3, scale: 1.01 }}
              className="glass-card rounded-[28px] border border-white/10 p-6 shadow-[0_24px_60px_-28px_rgba(59,130,246,0.45)]"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.title}</p>
              <p className="mt-2 text-4xl font-bold text-white">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Latest articles</h2>
            <p className="text-slate-400">Recent posts from your feeds, ready to summarize.</p>
          </div>
        </div>

        {loading ? (
          <Loader message="Loading dashboard..." />
        ) : error ? (
          <div className="rounded-[32px] border border-rose-500/20 bg-rose-500/5 p-6 text-sm text-rose-100">{error}</div>
        ) : latestArticles.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-slate-300">No articles yet. Add feeds to start filling your dashboard.</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id || article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
