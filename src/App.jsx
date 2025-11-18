import { useState } from 'react'
import SearchBar from './components/SearchBar'
import Results from './components/Results'
import Player from './components/Player'

function App() {
  const [items, setItems] = useState([])
  const [playing, setPlaying] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const onSearch = async (q) => {
    const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setItems(data)
  }

  const onPlay = (item) => {
    setPlaying(item)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Torrent Search & Stream</h1>
            <p className="text-blue-200">Search public demo torrents and stream video files directly in your browser.</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
            <SearchBar onSearch={onSearch} />
            <Results items={items} onPlay={onPlay} />
            {/* inline ad slot */}
            <div className="mt-6">
              <div className="w-full h-24 bg-slate-900/60 rounded-xl border border-slate-700 text-slate-300 flex items-center justify-center text-sm">
                Sponsored: Your ad here
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a href="/test" className="text-blue-300 hover:text-blue-200 underline">Backend status</a>
          </div>
        </div>
      </div>

      {playing && (
        <Player magnetURI={playing.magnet} onClose={() => setPlaying(null)} />
      )}
    </div>
  )
}

export default App
