'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import RouletteWheel from './RouletteWheel'
import BettingTable from './BettingTable'
import ChipSelection from './ChipSelection'
import GameStats from './GameStats'
import { toast } from 'sonner'

export interface Bet {
  type: string
  numbers: number[]
  amount: number
  position: string
}

export interface GameState {
  balance: number
  currentBets: Bet[]
  lastNumbers: number[]
  isSpinning: boolean
  winningNumber: number | null
}

export default function RouletteGame() {
  const [gameState, setGameState] = useState<GameState>({
    balance: 10000,
    currentBets: [],
    lastNumbers: [],
    isSpinning: false,
    winningNumber: null
  })

  const [selectedChip, setSelectedChip] = useState(100)
  const [bettingTime, setBettingTime] = useState(30)
  const [canBet, setCanBet] = useState(true)

  // Timer para las apuestas
  useEffect(() => {
    if (bettingTime > 0 && canBet && !gameState.isSpinning) {
      const timer = setTimeout(() => setBettingTime(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (bettingTime === 0 && canBet) {
      setCanBet(false)
      toast.warning("¡No más apuestas!")
    }
  }, [bettingTime, canBet, gameState.isSpinning])

  const placeBet = (bet: Omit<Bet, 'amount'>) => {
    if (!canBet || gameState.isSpinning || selectedChip > gameState.balance) {
      toast.error("No puedes apostar en este momento")
      return
    }

    const newBet: Bet = { ...bet, amount: selectedChip }

    setGameState(prev => ({
      ...prev,
      currentBets: [...prev.currentBets, newBet],
      balance: prev.balance - selectedChip
    }))

    toast.success(`Apuesta de $${selectedChip} en ${bet.type}`)
  }

  const spinRoulette = () => {
    if (gameState.currentBets.length === 0) {
      toast.error("Debes hacer al menos una apuesta")
      return
    }

    setGameState(prev => ({ ...prev, isSpinning: true }))
    setCanBet(false)

    // Simular giro (2-4 segundos)
    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37) // 0-36
      const totalWinnings = calculateWinnings(gameState.currentBets, winningNumber)

      setGameState(prev => ({
        ...prev,
        isSpinning: false,
        winningNumber,
        lastNumbers: [winningNumber, ...prev.lastNumbers.slice(0, 9)],
        balance: prev.balance + totalWinnings,
        currentBets: []
      }))

      if (totalWinnings > 0) {
        toast.success(`¡Ganaste $${totalWinnings}! Número: ${winningNumber}`)
      } else {
        toast.error(`Perdiste. Número ganador: ${winningNumber}`)
      }

      // Nuevo round
      setTimeout(() => {
        setBettingTime(30)
        setCanBet(true)
      }, 3000)

    }, 3000)
  }

  const calculateWinnings = (bets: Bet[], winningNumber: number): number => {
    return bets.reduce((total, bet) => {
      if (bet.numbers.includes(winningNumber)) {
        const multiplier = getPayoutMultiplier(bet.type, bet.numbers.length)
        return total + (bet.amount * multiplier)
      }
      return total
    }, 0)
  }

  const getPayoutMultiplier = (betType: string, numbersCount: number): number => {
    const payouts: { [key: string]: number } = {
      'straight': 36,
      'split': 18,
      'street': 12,
      'corner': 9,
      'line': 6,
      'column': 3,
      'dozen': 3,
      'red': 2,
      'black': 2,
      'odd': 2,
      'even': 2,
      'low': 2,
      'high': 2
    }
    return payouts[betType] || 2
  }

  const clearBets = () => {
    const totalBetAmount = gameState.currentBets.reduce((sum, bet) => sum + bet.amount, 0)
    setGameState(prev => ({
      ...prev,
      currentBets: [],
      balance: prev.balance + totalBetAmount
    }))
    toast.info("Apuestas eliminadas")
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Panel izquierdo - Stats y controles */}
      <div className="xl:col-span-1 space-y-4">
        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <div className="text-center space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Saldo</p>
              <p className="text-3xl font-bold text-green-400">${gameState.balance.toLocaleString()}</p>
            </div>

            {canBet && !gameState.isSpinning && (
              <div>
                <p className="text-gray-400 text-sm">Tiempo de apuesta</p>
                <p className="text-2xl font-bold text-yellow-400">{bettingTime}s</p>
              </div>
            )}

            <div className="space-y-2">
              <Button
                onClick={spinRoulette}
                disabled={gameState.isSpinning || gameState.currentBets.length === 0}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3"
              >
                {gameState.isSpinning ? 'GIRANDO...' : 'GIRAR RULETA'}
              </Button>

              <Button
                onClick={clearBets}
                disabled={gameState.isSpinning || gameState.currentBets.length === 0}
                variant="outline"
                className="w-full"
              >
                Limpiar Apuestas
              </Button>
            </div>

            {gameState.currentBets.length > 0 && (
              <div>
                <p className="text-gray-400 text-sm">Total Apostado</p>
                <p className="text-xl font-bold text-blue-400">
                  ${gameState.currentBets.reduce((sum, bet) => sum + bet.amount, 0)}
                </p>
              </div>
            )}
          </div>
        </Card>

        <ChipSelection selectedChip={selectedChip} onChipSelect={setSelectedChip} />
        <GameStats lastNumbers={gameState.lastNumbers} />
      </div>

      {/* Panel central - Ruleta y mesa */}
      <div className="xl:col-span-3 space-y-6">
        <RouletteWheel
          isSpinning={gameState.isSpinning}
          winningNumber={gameState.winningNumber}
        />

        <BettingTable
          onPlaceBet={placeBet}
          currentBets={gameState.currentBets}
          selectedChip={selectedChip}
          canBet={canBet && !gameState.isSpinning}
          winningNumber={gameState.winningNumber}
        />
      </div>
    </div>
  )
}
