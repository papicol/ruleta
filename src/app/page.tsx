import { useState } from 'react';
import RouletteGame from '../components/RouletteGame';

export default function Home() {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const toggleSound = () => setIsSoundOn(prev => !prev);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 flex flex-col">
      <div className="container mx-auto px-4 py-4 md:py-8 flex-1 flex flex-col">
        <header className="text-center mb-4 md:mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
            Papiweb CASINO ROYAL
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mt-2 font-light">
            Ruleta Europea Profesional
          </p>
        </header>

        <section className="flex-1 flex items-center justify-center">
          <RouletteGame setX={setX} setY={setY} />
        </section>

        <footer className="mt-8 py-4 border-t border-emerald-700">
          <div className="flex justify-center items-center space-x-4">
            <button
              className="p-2 rounded-full bg-emerald-700 hover:bg-emerald-600 transition-colors"
              onClick={toggleSound}
            >
              {isSoundOn ? (
                <div style={{
                  transform: `translate(
                    calc(-50% + ${x}px),
                    calc(-50% + ${y}px)
                  )`
                }} />
              ) : (
                <span className="text-yellow-300 text-2xl">🔇</span>
              )}
            </button>
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Casino Royal. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}