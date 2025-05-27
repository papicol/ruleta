'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'

interface RouletteWheelProps {
  isSpinning: boolean
  winningNumber: number | null
  onSpinComplete?: () => void
}

// Números de la ruleta europea en orden exacto del casino
const rouletteNumbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
]

const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
  if (num === 0) return 'green'
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
  return redNumbers.includes(num) ? 'red' : 'black'
}

const getColorName = (color: 'red' | 'black' | 'green'): string => {
  const colorNames = { red: 'ROJO', black: 'NEGRO', green: 'VERDE' }
  return colorNames[color]
}

export default function ProfessionalCasinoRoulette({ isSpinning, winningNumber, onSpinComplete }: RouletteWheelProps) {
  const [wheelRotation, setWheelRotation] = useState(0)
  const [ballAngle, setBallAngle] = useState(0)
  const [ballRadius, setBallRadius] = useState(240)
  const [ballSpeed, setBallSpeed] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'bouncing' | 'settled'>('idle')
  const [bounceCount, setBounceCount] = useState(0)
  const [soundEffect, setSoundEffect] = useState<'spin' | 'bounce' | 'settle' | null>(null)
  
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const lastBounceTime = useRef<number>(0)
  const phaseRef = useRef(phase)

  // Mantener la referencia del phase actualizada
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const resetToIdle = useCallback(() => {
    setPhase('idle')
    setSoundEffect(null)
    setBallRadius(240)
    setBallSpeed(0)
    setBounceCount(0)
    setWheelRotation(0)
    setBallAngle(0)
    setInitialSpeeds({ wheel: 0, ball: 0 }) // Reset de velocidades iniciales
  }, [])

  const settleOnWinningNumber = useCallback(() => {      if (winningNumber !== null) {
        const numberIndex = rouletteNumbers.indexOf(winningNumber)
        if (numberIndex !== -1) {
          // Usar un ángulo fijo en el servidor para evitar discrepancias
          const randomOffset = typeof window !== 'undefined' ? (Math.random() - 0.5) * 8 : 0
          const finalAngle = (numberIndex * 360) / 37 + randomOffset
          setBallAngle(finalAngle)
          setBallRadius(165)
        
        setTimeout(() => {
          if (onSpinComplete) onSpinComplete()
          setSoundEffect(null)
        }, 1000)
      }
    }
  }, [winningNumber, onSpinComplete])

  // Estado inicial para velocidades aleatorias
  const [initialSpeeds, setInitialSpeeds] = useState({ wheel: 0, ball: 0 })
  
  // Generar velocidades aleatorias solo en el cliente
  useEffect(() => {
    if (isSpinning && !initialSpeeds.wheel && !initialSpeeds.ball) {
      setInitialSpeeds({
        wheel: 3 + Math.random() * 2,
        ball: 25 + Math.random() * 10
      })
    }
  }, [isSpinning, initialSpeeds])

  useEffect(() => {
    if (!isSpinning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      // Reset después de mostrar el resultado
      if (phase === 'settled') {
        const resetTimer = setTimeout(resetToIdle, 3000)
        return () => clearTimeout(resetTimer)
      }
      return
    }

    // Inicializar spin solo si tenemos velocidades iniciales
    if (!initialSpeeds.wheel || !initialSpeeds.ball) return

    setPhase('spinning')
    setBounceCount(0)
    setSoundEffect('spin')

    const initialWheelSpeed = initialSpeeds.wheel
    const initialBallSpeed = initialSpeeds.ball

    setBallSpeed(initialBallSpeed)
    startTimeRef.current = Date.now()

    const animate = () => {
      const now = Date.now()
      const elapsed = (now - startTimeRef.current) / 1000

      // Animación de la rueda
      const wheelDeceleration = 0.15
      const currentWheelSpeed = Math.max(0, initialWheelSpeed - wheelDeceleration * elapsed)
      setWheelRotation(prev => prev + currentWheelSpeed * 6)

      const currentPhase = phaseRef.current

      if (currentPhase === 'spinning') {
        const ballDeceleration = 0.8
        const currentBallSpeed = Math.max(0, initialBallSpeed - ballDeceleration * elapsed)
        setBallSpeed(currentBallSpeed)

        setBallAngle(prev => (prev + currentBallSpeed) % 360)
        setBallRadius(240)

        // Transición a bouncing
        if (currentBallSpeed < 3 && elapsed > 3) {
          setPhase('bouncing')
          setBounceCount(0)
          setSoundEffect('bounce')
          lastBounceTime.current = now
        }

      } else if (currentPhase === 'bouncing') {
        const bounceTime = elapsed - 3
        const spiralSpeed = Math.max(1, 15 - bounceTime * 2)
        const targetRadius = 180 + Math.sin(bounceTime * 8) * 20

        setBallAngle(prev => (prev + spiralSpeed) % 360)
        setBallRadius(prev => Math.max(160, Math.min(prev, targetRadius - bounceTime * 15)))

        // Generar rebotes
        // Usar un intervalo fijo para los rebotes en el servidor
        const bounceInterval = typeof window !== 'undefined' ? 200 + Math.random() * 300 : 350
        if (now - lastBounceTime.current > bounceInterval) {
          setBounceCount(prev => {
            const newCount = prev + 1
            lastBounceTime.current = now
            // Usar un ángulo fijo en el servidor
            const bounceAngle = typeof window !== 'undefined' ? (Math.random() - 0.5) * 30 : 15
            setBallAngle(prev => prev + bounceAngle)
            return newCount
          })
        }

        // Transición a settled
        if (bounceTime > 2.5) {
          setPhase('settled')
          setSoundEffect('settle')
          settleOnWinningNumber()
          return // Salir de la animación
        }
      }
      
      // Continuar animación solo si está girando o rebotando
      if ((currentPhase === 'spinning' || currentPhase === 'bouncing') && isSpinning) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isSpinning, settleOnWinningNumber])

  const getNumberPosition = useCallback((index: number) => {
    const angle = (index * 360) / 37
    const radius = 165
    const x = radius * Math.cos((angle - 90) * (Math.PI / 180))
    const y = radius * Math.sin((angle - 90) * (Math.PI / 180))
    return { angle, x, y }
  }, [])

  const renderNumber = useCallback((number: number, index: number) => {
    const { x, y } = getNumberPosition(index)
    const color = getNumberColor(number)
    const isWinning = winningNumber === number && phase === 'settled'
    
    const colorClasses = {
      red: 'bg-gradient-to-br from-red-400 via-red-600 to-red-800 border-red-300 shadow-red-900/50',
      black: 'bg-gradient-to-br from-gray-600 via-gray-800 to-black border-gray-400 shadow-black/70',
      green: 'bg-gradient-to-br from-green-400 via-green-600 to-green-800 border-green-300 shadow-green-900/50'
    }
    
    return (
      <div
        key={number}
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          width: '40px',
          height: '40px',
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
          zIndex: isWinning ? 20 : 10
        }}
      >
        <div 
          className={`w-10 h-10 rounded-lg shadow-2xl border-2 flex items-center justify-center text-white text-sm font-bold transform transition-all duration-500
            ${colorClasses[color]}
            ${isWinning ? 'ring-4 ring-yellow-300 ring-offset-2 ring-offset-amber-700 scale-125 shadow-2xl shadow-yellow-400/80 animate-pulse' : 'hover:scale-105'}`}
          style={{
            transform: 'rotate(90deg)',
            boxShadow: isWinning 
              ? '0 0 30px rgba(250, 204, 21, 0.8), 0 0 60px rgba(250, 204, 21, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)' 
              : 'inset 0 2px 4px rgba(255, 255, 255, 0.15), 0 4px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          <span className="drop-shadow-lg font-extrabold tracking-tight">{number}</span>
          
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
          
          {isWinning && (
            <>
              <div className="absolute inset-0 rounded-lg bg-yellow-400/30 animate-ping" />
              <div className="absolute -inset-2 rounded-xl border-2 border-yellow-400 animate-pulse opacity-75" />
            </>
          )}
        </div>
      </div>
    )
  }, [getNumberPosition, winningNumber, phase])

  return (
    <div className="relative flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4 md:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-900 to-black opacity-90" />
      
      <div className="relative w-full max-w-[700px] mx-auto">
        <Card className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 p-8 md:p-12 rounded-full shadow-2xl border-8 border-amber-800 aspect-square flex items-center justify-center">
          
          {/* Indicador de sonido */}
          {soundEffect && (
            <div className="absolute top-4 right-4 text-white/60 text-sm font-mono">
              {soundEffect === 'spin' && '🎵 Girando...'}
              {soundEffect === 'bounce' && '🔊 Rebotando...'}
              {soundEffect === 'settle' && '✨ Asentándose...'}
            </div>
          )}
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Rueda principal */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 shadow-2xl transition-transform duration-100 ease-linear transform-gpu"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transformOrigin: 'center center'
              }}
            >
              {/* Divisores entre números */}
              {rouletteNumbers.map((_, index) => (
                <div
                  key={`divider-${index}`}
                  className="absolute w-1 bg-gradient-to-t from-gray-400 via-gray-300 to-gray-500 shadow-sm"
                  style={{
                    height: '120px',
                    transform: `translate(-50%, -50%) rotate(${(index * 360) / 37}deg) translateY(-190px)`,
                    transformOrigin: 'bottom center',
                    top: '50%',
                    left: '50%',
                    width: '2px'
                  }}
                />
              ))}
              
              {/* Números */}
              {rouletteNumbers.map(renderNumber)}
              
              {/* Centro de la rueda */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 shadow-2xl border-4 border-yellow-100/50">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900 border-4 border-yellow-500/40 shadow-inner">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-xl border-2 border-yellow-200" />
                  
                  {/* Marcas radiales */}
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-1 bg-gradient-to-t from-yellow-300 via-yellow-400 to-yellow-600 shadow-sm"
                      style={{
                        height: '28px',
                        transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-18px)`,
                        transformOrigin: 'center bottom'
                      }}
                    />
                  ))}
                  
                  <div className="absolute inset-6 rounded-full border-2 border-yellow-400/30" />
                  <div className="absolute inset-8 rounded-full border border-yellow-300/20" />
                  
                  {isSpinning && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-spin" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Bola */}
            <div
              className="absolute w-5 h-5 z-30 transform-gpu"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${ballAngle}deg) translateY(-${ballRadius}px)`,
                transformOrigin: 'center center',
                transition: phase === 'settled' ? 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
              }}
            >
              <div className={`relative w-full h-full rounded-full transition-all duration-150
                ${phase === 'bouncing' ? 'animate-bounce' : ''}
                ${phase === 'spinning' ? 'drop-shadow-lg' : ''}
                ${phase === 'settled' && winningNumber !== null ? 'ring-3 ring-yellow-300 ring-offset-2 scale-110' : ''}`}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-50 via-gray-200 to-gray-400 shadow-2xl border-2 border-gray-300 relative overflow-hidden">
                  {/* Reflejos de la bola */}
                  <div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-white opacity-90 blur-[0.5px]" />
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white opacity-70" />
                  <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-white/40" />
                  
                  {/* Efectos según la fase */}
                  {phase === 'spinning' && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-spin" />
                  )}
                  
                  {phase === 'bouncing' && (
                    <>
                      <div className="absolute -inset-1 rounded-full bg-white/30 animate-ping" />
                      <div className="absolute -inset-0.5 rounded-full border border-white/50 animate-pulse" />
                    </>
                  )}
                  
                  {phase === 'settled' && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/30 via-transparent to-transparent animate-pulse" />
                  )}
                </div>
                
                {/* Sombra de la bola */}
                <div 
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-1 bg-black/30 rounded-full blur-sm transition-all duration-150"
                  style={{
                    transform: `translateX(-50%) scaleX(${ballRadius / 240}) scaleY(${phase === 'bouncing' ? '0.5' : '1'})`,
                    opacity: phase === 'settled' ? 0.6 : 0.3
                  }}
                />
              </div>
            </div>
            
            {/* Marcador de posición */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-20">
              <div className="relative">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-yellow-400" />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-200 rounded-full shadow-sm animate-pulse" />
              </div>
            </div>
            
            {/* Efectos visuales adicionales */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/15 via-transparent to-amber-600/10 pointer-events-none" />
            
            {isSpinning && (
              <>
                <div className="absolute inset-8 rounded-full border-2 border-yellow-400/40 animate-pulse" />
                <div className="absolute inset-12 rounded-full border border-yellow-300/30 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent animate-spin" style={{ animationDuration: '3s' }} />
              </>
            )}
            
            {phase === 'settled' && winningNumber !== null && (
              <>
                <div className="absolute inset-4 rounded-full border-4 border-yellow-400/60 animate-pulse" />
                <div className="absolute inset-8 rounded-full border-2 border-yellow-300/40 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-600/20 animate-pulse" />
              </>
            )}
          </div>
          
          {/* Estados de la interfaz */}
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center space-y-4">
            {phase === 'spinning' && (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <p className="text-2xl font-bold text-yellow-400">La bola está girando...</p>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              </div>
            )}
            
            {phase === 'bouncing' && (
              <div className="text-center">
                <p className="text-xl text-orange-400 font-semibold animate-pulse">
                  Rebotando... ({bounceCount} rebotes)
                </p>
                <div className="flex justify-center space-x-1 mt-2">
                  {Array.from({ length: Math.min(bounceCount, 10) }, (_, i) => (
                    <div key={i} className="w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
              </div>
            )}
            
            {phase === 'settled' && winningNumber !== null && (
              <div className="text-center space-y-4">
                <p className="text-2xl text-green-400 font-bold">🎯 ¡Número Ganador! 🎯</p>
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold text-white shadow-2xl border-4 transform animate-pulse
                  ${(() => {
                    const color = getNumberColor(winningNumber)
                    const colorClasses = {
                      red: 'bg-gradient-to-br from-red-500 to-red-700 border-red-300',
                      black: 'bg-gradient-to-br from-gray-800 to-black border-gray-400',
                      green: 'bg-gradient-to-br from-green-500 to-green-700 border-green-300'
                    }
                    return colorClasses[color]
                  })()}`}
                >
                  {winningNumber}
                </div>
                <p className="text-lg text-gray-300">
                  Color: <span className={`font-bold ${(() => {
                    const color = getNumberColor(winningNumber)
                    const textColors = {
                      red: 'text-red-400',
                      black: 'text-gray-300',
                      green: 'text-green-400'
                    }
                    return textColors[color]
                  })()}`}>
                    {getColorName(getNumberColor(winningNumber))}
                  </span>
                </p>
              </div>
            )}
            
            {phase === 'idle' && !isSpinning && (
              <p className="text-xl text-gray-400 font-medium">Esperando próxima jugada...</p>
            )}
          </div>
          
          {/* Panel de información de debug */}
          {phase !== 'idle' && (
            <div className="absolute top-4 left-4 text-white/70 text-sm font-mono space-y-1">
              <div>Velocidad bola: {ballSpeed.toFixed(1)}</div>
              <div>Radio: {ballRadius.toFixed(0)}px</div>
              <div>Fase: {phase}</div>
              {bounceCount > 0 && <div>Rebotes: {bounceCount}</div>}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}