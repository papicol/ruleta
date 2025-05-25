'use client'

export default function Footer() {
  return (
    <footer className="w-full py-4 mt-8 bg-gray-900/50 border-t border-gray-800">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="text-blue-400 text-sm font-medium tracking-wide animate-pulse [text-shadow:_0_0_10px_rgb(59,130,246),_0_0_20px_rgb(59,130,246)]">
          © 2025 Papiweb Desarrollos Informáticos
        </div>
        <a
          href="https://link.mercadopago.com.ar/papiweb"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium tracking-wide animate-pulse [text-shadow:_0_0_10px_rgb(59,130,246),_0_0_20px_rgb(59,130,246)]"
        >
          <span>Invítame un café</span>
          <span role="img" aria-label="café humeante" className="text-xl">
            ☕
          </span>
        </a>
      </div>
    </footer>
  )
}
