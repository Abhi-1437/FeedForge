import React from 'react'

export default function FeedList({ feeds = [], onDelete = () => {} }) {
  if (!feeds || feeds.length === 0) return <div className="text-gray-600">No feeds yet.</div>

  return (
    <ul className="space-y-2">
      {feeds.map((f) => (
        <li key={f.id || f._id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
          <div className="text-sm">
            <div className="font-medium">{f.title || f.name || f.url}</div>
            <div className="text-xs text-gray-500">{f.url}</div>
          </div>
          <div>
            <button className="text-red-600 text-sm" onClick={() => onDelete(f.id || f._id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
// FeedList component placeholder
// Implementation intentionally omitted per user request
