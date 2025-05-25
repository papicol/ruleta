'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

interface RouletteWheelProps {
  isSpinning: boolean
  winningNumber: number | null
}

// Números de la ruleta europea en orden
const rouletteNumbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
]

const getNumberColor = (num: number): string => {
  if (num === 0) return 'green'
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
  return redNumbers.includes(num) ? 'red' : 'black'
}

export default function RouletteWheel({ isSpinning, winningNumber }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [ballPosition, setBallPosition] = useState(0)

  useEffect(() => {
    if (isSpinning) {
      // Giro de la rueda
      const finalRotation = rotation + 1440 + Math.random() * 360
      setRotation(finalRotation)

      // Animación de la bola
      const ballAnimation = setInterval(() => {
        setBallPosition(prev => (prev + 10) % 360)
      }, 50)

      setTimeout(() => {
        clearInterval(ballAnimation)
        if (winningNumber !== null) {
          const numberIndex = rouletteNumbers.indexOf(winningNumber)
          const numberAngle = (numberIndex * 360) / 37
          setBallPosition(numberAngle)
        }
      }, 2500)

      return () => clearInterval(ballAnimation)
    }
  }, [isSpinning, winningNumber, rotation])

  return (
    <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <div className="flex justify-center">
        <div className="relative">
          {/* Mesa de la ruleta */}
          <div className="w-96 h-96 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 p-4 shadow-2xl">

            {/* Rueda exterior */}
            <div
              className="w-full h-full rounded-full relative bg-gradient-to-br from-gray-800 to-gray-900 shadow-inner transition-transform duration-[3000ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Números de la ruleta */}
              {rouletteNumbers.map((number, index) => {
                const angle = (index * 360) / 37
                const color = getNumberColor(number)
                const isWinning = winningNumber === number && !isSpinning

                return (
                  <div
                    key={number}
                    className={`absolute w-8 h-8 flex items-center justify-center text-white text-sm font-bold rounded transition-all duration-300 ${
                      color === 'red' ? 'bg-red-600' :
                      color === 'black' ? 'bg-gray-900' : 'bg-green-600'
                    } ${isWinning ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-110' : ''}`}
                    style={{
                      transform: `rotate(${angle}deg) translateY(-170px) rotate(-${angle}deg)`,
                      transformOrigin: 'center'
                    }}
                  >
                    {number}
                  </div>
                )
              })}

              {/* Centro de la rueda */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gray-900" />
                </div>
              </div>
            </div>

            {/* Bola */}
            <div
              className="absolute w-4 h-4 bg-gradient-to-br from-gray-200 to-white rounded-full shadow-lg transition-all duration-100 z-10"
              style={{
                transform: `rotate(${ballPosition}deg) translateY(-180px)`,
                transformOrigin: 'center center',
                top: '50%',
                left: '50%',
                marginTop: '-8px',
                marginLeft: '-8px'
              }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-gray-300 shadow-inner" />
            </div>

            {/* Indicador de posición */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 clip-path-triangle shadow-lg" />
          </div>

          {/* Efectos de luz */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-yellow-400/20 pointer-events-none" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-transparent via-transparent to-white/10 pointer-events-none" />
        </div>
      </div>

      {/* Estado del juego */}
      <div className="text-center mt-6">
        {isSpinning ? (
          <div className="space-y-2">
            <p className="text-2xl font-bold text-yellow-400 animate-pulse">¡La ruleta está girando!</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400" />
            </div>
          </div>
        ) : winningNumber !== null ? (
          <div className="space-y-2">
            <p className="text-lg text-gray-300">Número ganador:</p>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold text-white ${
              getNumberColor(winningNumber) === 'red' ? 'bg-red-600' :
              getNumberColor(winningNumber) === 'black' ? 'bg-gray-900' : 'bg-green-600'
            } shadow-lg animate-pulse`}>
              {winningNumber}
            </div>
          </div>
        ) : (
          <p className="text-xl text-gray-400">¡Haz tus apuestas!</p>
        )}
      </div>
    </Card>
  )
}
