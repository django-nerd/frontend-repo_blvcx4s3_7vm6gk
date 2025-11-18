import { useEffect, useRef, useState } from 'react'

// This component uses WebTorrent in the browser via CDN (added in index.html dynamically)
export default function Player({ magnetURI, onClose }) {
  const videoRef = useRef(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Initializing...')
  const clientRef = useRef(null)

  useEffect(() => {
    let destroyed = false

    async function start() {
      try {
        setStatus('Setting up client...')
        // Dynamically load WebTorrent from CDN if not present
        if (!window.WebTorrent) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script')
            s.src = 'https://cdn.jsdelivr.net/npm/webtorrent@2.6.0/webtorrent.min.js'
            s.async = true
            s.onload = resolve
            s.onerror = () => reject(new Error('Failed to load WebTorrent library'))
            document.body.appendChild(s)
          })
        }

        if (destroyed) return

        const client = new window.WebTorrent()
        clientRef.current = client
        setStatus('Adding torrent...')

        client.add(magnetURI, { announce: [
          'wss://tracker.openwebtorrent.com',
          'wss://tracker.btorrent.xyz',
          'wss://tracker.fastcast.nz'
        ] }, (torrent) => {
          setStatus('Fetching metadata...')

          torrent.on('ready', () => {
            setStatus('Ready. Locating video file...')
            const file = torrent.files.find(f => /\.(mp4|webm|mkv|avi)$/i.test(f.name))
            if (!file) {
              setError('No video file found in this torrent.')
              return
            }
            setStatus(`Streaming ${file.name}`)
            file.renderTo(videoRef.current, { autoplay: true })
          })

          torrent.on('download', () => {
            const progress = (torrent.progress * 100).toFixed(1)
            setStatus(`Downloading... ${progress}% at ${formatBytes(torrent.downloadSpeed)}/s`)
          })

          torrent.on('done', () => setStatus('Download complete.'))
          torrent.on('error', (e) => setError(e.message))
        })
      } catch (e) {
        setError(e.message)
      }
    }

    start()

    return () => {
      destroyed = true
      try {
        clientRef.current?.destroy()
      } catch (e) {}
    }
  }, [magnetURI])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl">
        <div className="flex items-center justify-between p-3 border-b border-slate-700">
          <div className="text-sm text-blue-200">{status}</div>
          <button onClick={onClose} className="text-white bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded">Close</button>
        </div>
        <div className="p-3">
          {error ? (
            <div className="text-red-400 text-sm">{error}</div>
          ) : (
            <video ref={videoRef} controls className="w-full rounded-lg bg-black" />
          )}
        </div>
        {/* simple ad slot */}
        <div className="p-3 border-t border-slate-700">
          <div className="w-full h-20 bg-slate-800 rounded flex items-center justify-center text-slate-300 text-sm">
            Ad space
          </div>
        </div>
      </div>
    </div>
  )
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
