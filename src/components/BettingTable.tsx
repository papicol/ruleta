'use client'

import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import type { Bet } from './RouletteGame'
import { cn, formatCurrency } from "../lib/utils"

interface BettingTableProps {
  onPlaceBet: (bet: Omit<Bet, 'amount'>) => void
  currentBets: Bet[]
  selectedChip: number
  canBet: boolean
  winningNumber: number | null
}

const getNumberColor = (num: number): string => {
  if (num === 0) return 'green'
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
  return redNumbers.includes(num) ? 'red' : 'black'
}

const isWinningNumber = (number: number, winningNumber: number | null): boolean => {
  return winningNumber === number
}

export default function BettingTable({ onPlaceBet, currentBets, selectedChip, canBet, winningNumber }: BettingTableProps) {

  const getBetAmount = (position: string): number => {
    return currentBets
      .filter(bet => bet.position === position)
      .reduce((sum, bet) => sum + bet.amount, 0)
  }

  const placeStraightBet = (number: number) => {
    if (!canBet) return
    onPlaceBet({
      type: 'straight',
      numbers: [number],
      position: `straight-${number}`
    })
  }

  const placeOutsideBet = (type: string, numbers: number[]) => {
    if (!canBet) return
    onPlaceBet({
      type,
      numbers,
      position: type
    })
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-900 to-emerald-800 border-gray-700">
      <div className="space-y-4">

        {/* Números principales 1-36 + 0 */}
        <div className="bg-emerald-950/50 p-4 rounded-lg">
          {/* Cero */}
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => placeStraightBet(0)}
              disabled={!canBet}
              className={`
                relative w-16 h-16 rounded-lg font-bold text-white text-xl transition-all duration-200
                ${isWinningNumber(0, winningNumber)
                  ? 'bg-green-400 ring-4 ring-yellow-400 animate-pulse'
                  : 'bg-green-600 hover:bg-green-500'
                }
                ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
              `}
            >
              0
              {getBetAmount('straight-0') > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs">
                  ${getBetAmount('straight-0')}
                </Badge>
              )}
            </button>
          </div>

          {/* Grid de números 1-36 */}
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 36 }, (_, i) => i + 1).map(number => {
              const color = getNumberColor(number)
              const isWinning = isWinningNumber(number, winningNumber)

              return (
                <button
                  key={number}
                  onClick={() => placeStraightBet(number)}
                  disabled={!canBet}
                  className={`
                    relative h-12 rounded font-bold text-white transition-all duration-200
                    ${isWinning
                      ? `${color === 'red' ? 'bg-red-400' : 'bg-gray-700'} ring-4 ring-yellow-400 animate-pulse`
                      : `${color === 'red' ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-800 hover:bg-gray-700'}`
                    }
                    ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
                  `}
                >
                  {number}
                  {getBetAmount(`straight-${number}`) > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs scale-75">
                      ${getBetAmount(`straight-${number}`)}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Apuestas exteriores */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">

          {/* Primera docena */}
          <button
            onClick={() => placeOutsideBet('dozen', Array.from({ length: 12 }, (_, i) => i + 1))}
            disabled={!canBet}
            className={`
              relative h-16 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-200
              ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
            `}
          >
            1ª DOCENA
            {getBetAmount('dozen') > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs">
                ${getBetAmount('dozen')}
              </Badge>
            )}
          </button>

          {/* Segunda docena */}
          <button
            onClick={() => placeOutsideBet('dozen', Array.from({ length: 12 }, (_, i) => i + 13))}
            disabled={!canBet}
            className={`
              relative h-16 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-200
              ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
            `}
          >
            2ª DOCENA
          </button>

          {/* Tercera docena */}
          <button
            onClick={() => placeOutsideBet('dozen', Array.from({ length: 12 }, (_, i) => i + 25))}
            disabled={!canBet}
            className={`
              relative h-16 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-200
              ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
            `}
          >
            3ª DOCENA
          </button>

          {/* Rojo */}
          <button
            onClick={() => placeOutsideBet('red', [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36])}
            disabled={!canBet}
            className={`
              relative h-16 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-200
              ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
            `}
          >
            ROJO
            {getBetAmount('red') > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs">
                ${getBetAmount('red')}
              </Badge>
            )}
          </button>

          {/* Negro */}
          <button
            onClick={() => placeOutsideBet('black', [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35])}
            disabled={!canBet}
            className={`
              relative h-16 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg transition-all duration-200
              ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
            `}
          >
            NEGRO
            {getBetAmount('black') > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs">
                ${getBetAmount('black')}
              </Badge>
            )}
          </button>

          {/* Par */}
          <button
            onClick={() => placeOutsideBet('even', Array.from({ length: 18 }, (_, i) => (i + 1) * 2))}
            disabled={!canBet}
            className={`
              relative h-16 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all duration-200
              ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
            `}
          >
            PAR
            {getBetAmount('even') > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs">
                ${getBetAmount('even')}
              </Badge>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Impar */}
          <button
            onClick={() => placeOutsideBet('odd', Array.from({ length: 18 }, (_, i) => i * 2 + 1))}
            disabled={!canBet}
            className={`
              relative h-16 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all duration-200
              ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
            `}
          >
            IMPAR
            {getBetAmount('odd') > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs">
                ${getBetAmount('odd')}
              </Badge>
            )}
          </button>

          {/* 1-18 */}
          <button
            onClick={() => placeOutsideBet('low', Array.from({ length: 18 }, (_, i) => i + 1))}
            disabled={!canBet}
            className={`
              relative h-16 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all duration-200
              ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
            `}
          >
            1-18
            {getBetAmount('low') > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs">
                ${getBetAmount('low')}
              </Badge>
            )}
          </button>

          {/* 19-36 */}
          <button
            onClick={() => placeOutsideBet('high', Array.from({ length: 18 }, (_, i) => i + 19))}
            disabled={!canBet}
            className={`
              relative h-16 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-all duration-200
              ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
            `}
          >
            19-36
            {getBetAmount('high') > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs">
                ${getBetAmount('high')}
              </Badge>
            )}
          </button>

          {/* Columnas */}
          <button
            onClick={() => placeOutsideBet('column', [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34])}
            disabled={!canBet}
            className={`
              relative h-16 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all duration-200
              ${!canBet ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-lg'}
            `}
          >
            COLUMNA
            {getBetAmount('column') > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs">
                ${getBetAmount('column')}
              </Badge>
            )}
          </button>
        </div>

        {/* Información de apuestas */}
        {currentBets.length > 0 && (
          <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">Apuestas activas:</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              {currentBets.map((bet) => (
                <div key={`${bet.position}-${bet.type}-${bet.amount}`} className="bg-blue-800/50 p-2 rounded">
                  <span className="font-semibold">{bet.type.toUpperCase()}</span>
                  <span className="text-yellow-400 ml-2">{formatCurrency(bet.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
