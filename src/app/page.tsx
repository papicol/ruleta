import RouletteGame from '@/components/RouletteGame'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
            CASINO ROYAL
          </h1>
          <p className="text-xl text-gray-200 mt-2 font-light">
            Ruleta Europea Profesional
          </p>
        </div>
        <RouletteGame />
      </div>
    </main>
  )
}
