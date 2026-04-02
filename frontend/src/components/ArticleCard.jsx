import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { generateSummary } from '../services/api'

const STORAGE_KEYS = {
  read: 'feedforge_read_articles',
  bookmarked: 'feedforge_bookmarked_articles',
}

const safeParse = (value) => {
  try {
    return JSON.parse(value || '[]')
  } catch {
    return []
  }
}

const loadIds = (key) => {
  if (typeof window === 'undefined') return []
  return safeParse(window.localStorage.getItem(key))
}

const saveIds = (key, ids) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(ids))
}

const getArticleKey = (article) => article.id || article._id || article.link || article.url || article.title || 'unknown-article'

export default function ArticleCard({ article }) {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(null)
  const [showSummaryPanel, setShowSummaryPanel] = useState(false)
  const [error, setError] = useState(null)
  const [isRead, setIsRead] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const articleKey = getArticleKey(article)

  useEffect(() => {
    if (!articleKey) return
    setIsRead(loadIds(STORAGE_KEYS.read).includes(articleKey))
    setIsBookmarked(loadIds(STORAGE_KEYS.bookmarked).includes(articleKey))
  }, [articleKey])

  const toggleStorage = (key, enabled, setter) => {
    if (!articleKey) return
    const ids = loadIds(key)
    const nextIds = enabled ? [...new Set([...ids, articleKey])] : ids.filter((id) => id !== articleKey)
    saveIds(key, nextIds)
    setter(enabled)
  }

  const handleToggleRead = () => {
    toggleStorage(STORAGE_KEYS.read, !isRead, setIsRead)
  }

  const handleToggleBookmark = () => {
    toggleStorage(STORAGE_KEYS.bookmarked, !isBookmarked, setIsBookmarked)
  }

  const handleSummary = () => {
    setLoading(true)
    setError(null)
    generateSummary({ id: article.id || article._id, url: article.link || article.url })
      .then((res) => {
        setSummary(res.data.summary || res.data || 'No summary returned')
        setShowSummaryPanel(true)
      })
      .catch((e) => setError(e.response?.data?.msg || e.message || 'Failed to generate summary'))
      .finally(() => setLoading(false))
  }

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="group glass-card rounded-[32px] border border-white/10 p-6 shadow-[0_30px_80px_-45px_rgba(59,130,246,0.45)] hover:shadow-glow"
    >
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex-1 space-y-4">
          <a
            href={article.link || article.url || '#'}
            target="_blank"
            rel="noreferrer"
            className="text-xl font-bold text-white transition hover:text-[#8B5CF6]"
          >
            {article.title || 'Untitled article'}
          </a>
          <p className="text-sm leading-6 text-slate-400">{article.description || article.summary || 'No description available.'}</p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            {article.feedTitle && <span className="rounded-full bg-white/5 px-3 py-1">{article.feedTitle}</span>}
            {article.publishedAt && <span className="rounded-full bg-white/5 px-3 py-1">{new Date(article.publishedAt).toLocaleDateString()}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleToggleRead}
            className={`rounded-3xl px-4 py-3 text-sm font-medium transition ${
              isRead ? 'bg-emerald-500/15 text-emerald-200' : 'bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            {isRead ? 'Read ✅' : 'Mark as read'}
          </button>
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`rounded-3xl px-4 py-3 text-sm font-medium transition ${
              isBookmarked ? 'bg-cyan-400/15 text-cyan-200' : 'bg-white/5 text-slate-200 hover:bg-white/10'
            }`}
          >
            {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
          </button>
          <button
            type="button"
            onClick={handleSummary}
            disabled={loading}
            className="btn-glow rounded-3xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Summarizing...' : 'Generate summary'}
          </button>
        </div>
      </div>

      {error && <div className="mt-4 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

      <AnimatePresence>
        {summary && (
          <motion.section
            className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0E152F]/80 p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Summary</h4>
              <button
                type="button"
                onClick={() => setShowSummaryPanel((prev) => !prev)}
                className="text-xs text-slate-300 transition hover:text-white"
              >
                {showSummaryPanel ? 'Hide' : 'Show'}
              </button>
            </div>
            <AnimatePresence>
              {showSummaryPanel && (
                <motion.p
                  className="mt-3 text-sm leading-6 text-slate-300"
                  key="summary-panel"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {summary}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
