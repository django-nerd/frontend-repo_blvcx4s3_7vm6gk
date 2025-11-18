export default function Results({ items = [], onPlay }) {
  if (!items.length) {
    return (
      <div className="text-center text-blue-200/70 text-sm py-8">
        No results yet. Try a search.
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between bg-slate-800/50 border border-blue-500/10 rounded-xl p-4">
          <div>
            <div className="text-white font-semibold">{item.title}</div>
            <div className="text-xs text-blue-200/70 mt-1">
              {item.size ? `${item.size} • ` : ''}Seeds {item.seeds ?? 0} • Peers {item.peers ?? 0}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlay(item)}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-500 transition"
            >
              Play
            </button>
            <a
              href={item.magnet}
              className="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600 transition"
            >
              Magnet
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
