import RouletteGame from '../components/RouletteGame'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 flex flex-col">
      <div className="container mx-auto px-4 py-4 md:py-8 flex-1 flex flex-col">
        <div className="text-center mb-4 md:mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
            CASINO ROYAL
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mt-2 font-light">
            Ruleta Europea Profesional
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <RouletteGame />
        </div>
      </div>
    </main>
  )
}
