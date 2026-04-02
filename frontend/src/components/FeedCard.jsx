import { motion } from 'framer-motion'

export default function FeedCard({ feed, onDelete }) {
  const id = feed.id || feed._id

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className="group glass-card flex flex-col gap-4 rounded-[28px] border border-white/10 p-6 shadow-[0_30px_80px_-45px_rgba(59,130,246,0.45)] hover:shadow-glow"
    >
      <div className="flex flex-col gap-2">
        <div className="text-base font-semibold text-white">{feed.title || feed.name || 'Untitled Feed'}</div>
        <a href={feed.url} target="_blank" rel="noreferrer" className="text-sm text-slate-400 transition hover:text-white">
          {feed.url}
        </a>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">RSS Feed</span>
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="rounded-3xl bg-[#F8FAFC]/10 px-4 py-2 text-sm font-medium text-[#F8FAFC] transition hover:bg-[#3B82F6]/30 opacity-0 group-hover:opacity-100"
        >
          Delete
        </button>
      </div>
    </motion.article>
  )
}
