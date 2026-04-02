export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center rounded-[32px] border border-white/10 px-8 py-12 text-center text-slate-300">
      <div className="mb-5 h-14 w-14 rounded-full border-4 border-white/20 border-t-[#3B82F6] animate-spin" />
      <p className="text-sm text-slate-300 mb-6">{message}</p>
      <div className="h-2 w-48 rounded-full bg-white/10 shimmer" />
    </div>
  )
}
