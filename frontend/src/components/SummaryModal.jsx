import { AnimatePresence, motion } from 'framer-motion'

export default function SummaryModal({ open, onClose, title, summary }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card max-w-3xl w-full rounded-[32px] border border-white/10 p-6 shadow-2xl"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Summary for</h3>
                <p className="mt-1 text-sm text-slate-400">{title}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center rounded-3xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mt-5 max-h-[60vh] overflow-y-auto rounded-3xl bg-[#111827] p-5 text-sm leading-6 text-slate-300">
              {summary ? summary : 'No summary available.'}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
