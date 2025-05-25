'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface GameStatsProps {
  lastNumbers: number[]
}

const getNumberColor = (num: number): string => {
  if (num === 0) return 'green'
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
  return redNumbers.includes(num) ? 'red' : 'black'
}

export default function GameStats({ lastNumbers }: GameStatsProps) {
  // Calcular estadísticas
  const redCount = lastNumbers.filter(num => getNumberColor(num) === 'red').length
  const blackCount = lastNumbers.filter(num => getNumberColor(num) === 'black').length
  const greenCount = lastNumbers.filter(num => getNumberColor(num) === 'green').length

  const evenCount = lastNumbers.filter(num => num !== 0 && num % 2 === 0).length
  const oddCount = lastNumbers.filter(num => num !== 0 && num % 2 === 1).length

  const lowCount = lastNumbers.filter(num => num >= 1 && num <= 18).length
  const highCount = lastNumbers.filter(num => num >= 19 && num <= 36).length

  return (
    <div className="space-y-4">
      {/* Últimos números */}
      <Card className="p-4 bg-gray-900/50 border-gray-700">
        <h3 className="text-lg font-bold text-white mb-3 text-center">Últimos Números</h3>

        {lastNumbers.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No hay números aún</p>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1 justify-center">
              {lastNumbers.slice(0, 10).map((number, index) => {
                const color = getNumberColor(number)
                return (
                  <div
                    key={`number-${lastNumbers.length - index}-${number}`}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                      ${color === 'red' ? 'bg-red-600' :
                        color === 'black' ? 'bg-gray-900' : 'bg-green-600'}
                      ${index === 0 ? 'ring-2 ring-yellow-400' : ''}
                    `}
                  >
                    {number}
                  </div>
                )
              })}
            </div>

            {lastNumbers.length > 10 && (
              <p className="text-center text-xs text-gray-400">
                +{lastNumbers.length - 10} más
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Estadísticas */}
      {lastNumbers.length > 0 && (
        <Card className="p-4 bg-gray-900/50 border-gray-700">
          <h3 className="text-lg font-bold text-white mb-3 text-center">Estadísticas</h3>

          <div className="space-y-3 text-sm">
            {/* Colores */}
            <div>
              <p className="text-gray-400 mb-1">Colores:</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded" />
                  <span className="text-white">Rojo: {redCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-900 rounded border border-gray-600" />
                  <span className="text-white">Negro: {blackCount}</span>
                </div>
                {greenCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded" />
                    <span className="text-white">Verde: {greenCount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Par/Impar */}
            <div>
              <p className="text-gray-400 mb-1">Par/Impar:</p>
              <div className="flex justify-between">
                <span className="text-white">Par: {evenCount}</span>
                <span className="text-white">Impar: {oddCount}</span>
              </div>
            </div>

            {/* Alto/Bajo */}
            <div>
              <p className="text-gray-400 mb-1">Alto/Bajo:</p>
              <div className="flex justify-between">
                <span className="text-white">1-18: {lowCount}</span>
                <span className="text-white">19-36: {highCount}</span>
              </div>
            </div>

            {/* Racha actual */}
            {lastNumbers.length >= 2 && (
              <div>
                <p className="text-gray-400 mb-1">Racha actual:</p>
                {(() => {
                  const lastColor = getNumberColor(lastNumbers[0])
                  let streakCount = 1

                  for (let i = 1; i < lastNumbers.length; i++) {
                    if (getNumberColor(lastNumbers[i]) === lastColor) {
                      streakCount++
                    } else {
                      break
                    }
                  }

                  return (
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${
                        lastColor === 'red' ? 'bg-red-600' :
                        lastColor === 'black' ? 'bg-gray-900 border border-gray-600' : 'bg-green-600'
                      }`} />
                      <span className="text-white">
                        {streakCount} {lastColor === 'red' ? 'rojos' : lastColor === 'black' ? 'negros' : 'verdes'} seguidos
                      </span>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Números calientes */}
      {lastNumbers.length >= 5 && (
        <Card className="p-4 bg-gray-900/50 border-gray-700">
          <h3 className="text-lg font-bold text-white mb-3 text-center">Números Calientes</h3>

          {(() => {
            const numberCounts = lastNumbers.reduce((acc, num) => {
              acc[num] = (acc[num] || 0) + 1
              return acc
            }, {} as Record<number, number>)

            const hotNumbers = Object.entries(numberCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .filter(([,count]) => count > 1)

            return hotNumbers.length > 0 ? (
              <div className="space-y-2">
                {hotNumbers.map(([number, count]) => {
                  const num = Number.parseInt(number)
                  const color = getNumberColor(num)
                  return (
                    <div key={number} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs
                          ${color === 'red' ? 'bg-red-600' :
                            color === 'black' ? 'bg-gray-900' : 'bg-green-600'}
                        `}>
                          {num}
                        </div>
                        <span className="text-white text-sm">Número {num}</span>
                      </div>
                      <Badge variant="secondary" className="bg-orange-600 text-white">
                        {count}x
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm">No hay números calientes aún</p>
            )
          })()}
        </Card>
      )}
    </div>
  )
}
