'use client'
import { useEffect, useRef, useState } from 'react'

export function Footer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const ambienteRef = useRef<HTMLAudioElement>(null)
  const [ambienteOn, setAmbienteOn] = useState(true)

  // Reproducir sonido ambiente al montar el componente
  useEffect(() => {
    if (ambienteRef.current) {
      ambienteRef.current.volume = 0.25
      ambienteRef.current.loop = true
      if (ambienteOn) {
        ambienteRef.current.play().catch(() => {})
      } else {
        ambienteRef.current.pause()
      }
    }
  }, [ambienteOn])

  const handleCafeClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  const handleAmbienteToggle = () => {
    setAmbienteOn((prev) => !prev)
  }

  return (
    <footer className="w-full py-4 mt-8 bg-gray-900/50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="text-[rgb(255,215,0)] text-sm font-medium tracking-wide animate-pulse [text-shadow:_0_0_10px_rgb(255,215,0),_0_0_20px_rgb(255,215,0)]">
          © 2025 <span className="font-bold">Papiweb</span> Desarrollos Informáticos
        </div>
        <a
          href="https://link.mercadopago.com.ar/papiweb"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-medium tracking-wide animate-pulse text-[rgb(255,215,0)] hover:text-yellow-300 transition-colors [text-shadow:_0_0_10px_rgb(255,215,0),_0_0_20px_rgb(255,215,0)]"
          onClick={handleCafeClick}
        >
          <span className="font-bold">Invítame un café</span>
          <span role="img" aria-label="café humeante" className="text-xl">
            ☕
          </span>
        </a>
        <audio ref={audioRef} src="/relaxing.mp3" preload="auto" />
        <audio ref={ambienteRef} src="/casino-ambiente.mp3" preload="auto" />
        <button
          onClick={handleAmbienteToggle}
          className="ml-4 p-2 rounded-full bg-gray-800 hover:bg-yellow-400/30 transition-colors shadow text-yellow-300 flex items-center justify-center"
          title={ambienteOn ? 'Desactivar sonido ambiente' : 'Activar sonido ambiente'}
          aria-label="Toggle ambiente"
          style={{ outline: 'none' }}
        >
          {ambienteOn ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 opacity-60">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
              <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </button>
      </div>
    </footer>
  )
}
