'use client'

import { useEffect, useState, useRef } from 'react'
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

const getNumberColor = (num: number): string => {
  if (num === 0) return 'green'
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
  return redNumbers.includes(num) ? 'red' : 'black'
}

export default function ProfessionalCasinoRoulette({ isSpinning, winningNumber, onSpinComplete }: RouletteWheelProps) {
  // Constantes
  const INITIAL_RADIUS = 240;
  const FINAL_RADIUS = 165;
  const INITIAL_BALL_SPEED = 25;
  const MIN_BOUNCE_COUNT = 3;
  const MAX_BOUNCE_COUNT = 8;
  
  // Tipos
  type PhaseType = 'idle' | 'spinning' | 'bouncing' | 'settled';
  type SoundType = 'spin' | 'bounce' | 'settle' | null;
  
  // Estados
  const [wheelRotation, setWheelRotation] = useState(0)
  const [ballAngle, setBallAngle] = useState(0)
  const [ballRadius, setBallRadius] = useState(INITIAL_RADIUS)
  const [ballSpeed, setBallSpeed] = useState(0)
  const [phase, setPhase] = useState<PhaseType>('idle')
  const [bounceCount, setBounceCount] = useState(0)
  const [soundEffect, setSoundEffect] = useState<SoundType>(null)
  
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const lastBounceTime = useRef<number>(0)

  // Simulación de física realista de casino
  useEffect(() => {
    let isMounted = true;

    const startAnimation = () => {
      if (!isMounted) return;
      
      setPhase('spinning')
      setBounceCount(0)
      setSoundEffect('spin')
      
      // Velocidades iniciales realistas
      const initialWheelSpeed = 3 + Math.random() * 2 // 3-5 rpm
      const initialBallSpeed = INITIAL_BALL_SPEED + Math.random() * 10 // Velocidad inicial de la bola
      
      setBallSpeed(initialBallSpeed)
      startTimeRef.current = Date.now()
      
      const animate = () => {
        const now = Date.now()
        const elapsed = (now - startTimeRef.current!) / 1000 // en segundos
        
        // Rotación de la rueda (desaceleración gradual)
        const wheelDeceleration = 0.15
        const currentWheelSpeed = Math.max(0, initialWheelSpeed - wheelDeceleration * elapsed)
        setWheelRotation(prev => prev + currentWheelSpeed * 6) // 6 grados por frame a 60fps
        
        if (phase === 'spinning') {
          // Fase de giro inicial - bola en el borde exterior
          const ballDeceleration = 0.8
          const currentBallSpeed = Math.max(0, initialBallSpeed - ballDeceleration * elapsed)
          setBallSpeed(currentBallSpeed)
          
          setBallAngle(prev => (prev + currentBallSpeed) % 360)
          setBallRadius(240) // Radio exterior
          
          // Transición a fase de caída cuando la bola se ralentiza
          if (currentBallSpeed < 3 && elapsed > 3) {
            setPhase('bouncing')
            setBounceCount(0)
            setSoundEffect('bounce')
          }
          
        } else if (phase === 'bouncing') {
          // Fase de rebotes - la bola cae hacia el centro
          const bounceTime = elapsed - 3
          const spiralSpeed = 15 - bounceTime * 2
          const targetRadius = 180 + Math.sin(bounceTime * 8) * 20 // Efecto de rebote
          
          setBallAngle(prev => (prev + Math.max(1, spiralSpeed)) % 360)
          setBallRadius(Math.max(160, targetRadius - bounceTime * 15))
          
          // Simular rebotes aleatorios
          if (now - lastBounceTime.current > 200 + Math.random() * 300) {
            setBounceCount(prev => prev + 1)
            lastBounceTime.current = now
            
            // Cambio aleatorio de dirección en rebotes
            setBallAngle(prev => prev + (Math.random() - 0.5) * 30)
          }
          
          // Transición a asentamiento final
          if (bounceTime > 2.5 || bounceCount > 8) {
            setPhase('settled')
            setSoundEffect('settle')
            
            // Posicionar en el número ganador
            if (winningNumber !== null) {
              const numberIndex = rouletteNumbers.indexOf(winningNumber)
              const finalAngle = (numberIndex * 360) / 37 + (Math.random() - 0.5) * 8 // Pequeña variación
              
              setBallAngle(finalAngle)
              setBallRadius(165) // Radio final en los números
              
              setTimeout(() => {
                onSpinComplete?.()
                setSoundEffect(null)
              }, 1000)
            }
          }
        }
        if (phase === 'spinning' || phase === 'bouncing') {
          animationRef.current = requestAnimationFrame(animate)
        }
      }
      
      if (isSpinning) {
        animationRef.current = requestAnimationFrame(animate)
      }
      
      return () => {
        isMounted = false;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [isSpinning, phase, winningNumber, bounceCount, onSpinComplete])

  // Gestión de transiciones de estado y reseteo
  useEffect(() => {
    if (!isSpinning && phase !== 'idle') {
      // Dar tiempo para que se complete la animación de asentamiento
      const resetTimer = setTimeout(() => {
        if (phase === 'settled') {
          setPhase('idle')
          setSoundEffect(null)
          setBallRadius(INITIAL_RADIUS)
          setBallSpeed(0)
          setBounceCount(0)
        }
      }, 2000)

      return () => clearTimeout(resetTimer)
    }
  }, [isSpinning, phase, INITIAL_RADIUS])

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-8">
      {/* Mesa de casino */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-900 to-black opacity-90" />
      
      {/* Efectos de sonido visuales */}
      {soundEffect && (
        <div className="absolute top-4 right-4 text-white/60 text-sm font-mono">
          {soundEffect === 'spin' && '🎵 Girando...'}
          {soundEffect === 'bounce' && '🔊 Rebotando...'}
          {soundEffect === 'settle' && '✨ Asentándose...'}
        </div>
      )}
      
      <Card className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 p-12 rounded-full shadow-2xl border-8 border-gradient-to-br from-yellow-600 to-amber-800 max-w-[700px] aspect-square">
        
        {/* Borde exterior decorativo de casino */}
        <div className="absolute inset-4 rounded-full border-4 border-yellow-500/80 shadow-inner" />
        <div className="absolute inset-6 rounded-full border-2 border-yellow-400/60" />
        
        {/* Rueda principal */}
        <div className="relative w-full h-full">
          
          {/* Base de madera de la rueda */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 shadow-2xl transition-transform duration-100 ease-linear transform-gpu"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transformOrigin: 'center center'
            }}
          >
            
            {/* Separadores metálicos entre números */}
            {rouletteNumbers.map((_, index) => {
              const angle = (index * 360) / 37
              return (
                <div
                  key={`divider-${index}`}
                  className="absolute w-1 bg-gradient-to-t from-gray-400 via-gray-300 to-gray-500 shadow-sm"
                  style={{
                    height: '120px',
                    transform: `rotate(${angle}deg) translateY(-190px)`,
                    transformOrigin: 'center bottom',
                    top: '50%',
                    left: '50%',
                    marginLeft: '-2px'
                  }}
                />
              )
            })}
            
            {/* Slots de números con efecto 3D perfectamente centrados */}
            {rouletteNumbers.map((number, index) => {
              const angle = (index * 360) / 37
              const color = getNumberColor(number)
              const isWinning = winningNumber === number && phase === 'settled'
              
              return (
                <div
                  key={number}
                  className="absolute"
                  style={{
                    top: '50%',
                    left: '50%',
                    width: '40px',
                    height: '40px',
                    marginLeft: '-20px',
                    marginTop: '-20px',
                    transform: `rotate(${angle}deg) translateY(-165px) rotate(-${angle}deg)`,
                    transformOrigin: 'center center'
                  }}
                >
                  {/* Slot del número con efecto 3D mejorado */}
                  <div 
                    className={`w-10 h-10 rounded-lg shadow-2xl border-2 flex items-center justify-center text-white text-sm font-bold transform transition-all duration-500
                      ${color === 'red' 
                        ? 'bg-gradient-to-br from-red-400 via-red-600 to-red-800 border-red-300 shadow-red-900/50' 
                        : color === 'black' 
                        ? 'bg-gradient-to-br from-gray-600 via-gray-800 to-black border-gray-400 shadow-black/70'
                        : 'bg-gradient-to-br from-green-400 via-green-600 to-green-800 border-green-300 shadow-green-900/50'}
                      ${isWinning ? 'ring-4 ring-yellow-300 ring-offset-2 ring-offset-amber-700 scale-125 z-20 shadow-2xl shadow-yellow-400/80 animate-pulse' : 'hover:scale-105'}`}
                    style={{
                      transform: `rotate(-${angle}deg) ${isWinning ? 'scale(1.25)' : ''}`,
                      boxShadow: isWinning 
                        ? '0 0 30px rgba(250, 204, 21, 0.8), 0 0 60px rgba(250, 204, 21, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)' 
                        : 'inset 0 2px 4px rgba(255, 255, 255, 0.15), 0 4px 8px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <span className="drop-shadow-lg font-extrabold tracking-tight">{number}</span>
                    
                    {/* Efecto de brillo interno */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Efecto de resaltado para número ganador */}
                    {isWinning && (
                      <>
                        <div className="absolute inset-0 rounded-lg bg-yellow-400/30 animate-ping" />
                        <div className="absolute -inset-2 rounded-xl border-2 border-yellow-400 animate-pulse opacity-75" />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
            
          {/* Centro de la rueda - hub metálico mejorado */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 shadow-2xl border-4 border-yellow-100/50 relative">
              
              {/* Anillo exterior decorativo */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900 border-4 border-yellow-500/40 shadow-inner">
                
                {/* Centro metálico */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-xl border-2 border-yellow-200" />
                
                {/* Rayos decorativos mejorados */}
                {[...Array(12)].map((_, i) => (
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
                
                {/* Círculos concéntricos decorativos */}
                <div className="absolute inset-6 rounded-full border-2 border-yellow-400/30" />
                <div className="absolute inset-8 rounded-full border border-yellow-300/20" />
                
                {/* Efecto de brillo rotatorio */}
                {isSpinning && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-spin" />
                )}
              </div>
              
              {/* Reflejo exterior */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
          </div>
          
          {/* Bola de casino con física realista y efectos mejorados */}
          <div
            className="absolute w-5 h-5 z-30 transform-gpu"
            style={{
              top: '50%',
              left: '50%',
              marginTop: '-10px',
              marginLeft: '-10px',
              transform: `rotate(${ballAngle}deg) translateY(-${ballRadius}px)`,
              transformOrigin: 'center center',
              transition: phase === 'settled' ? 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
          >
            <div className={`relative w-full h-full rounded-full transition-all duration-150
              ${phase === 'bouncing' ? 'animate-bounce' : ''}
              ${phase === 'spinning' ? 'drop-shadow-lg' : ''}
              ${phase === 'settled' && winningNumber !== null ? 'ring-3 ring-yellow-300 ring-offset-2 scale-110' : ''}`}
            >
              {/* Bola principal con efecto 3D mejorado */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-50 via-gray-200 to-gray-400 shadow-2xl border-2 border-gray-300 relative overflow-hidden">
                
                {/* Reflejos de luz múltiples */}
                <div className="absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-white opacity-90 blur-[0.5px]" />
                <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-white opacity-70" />
                <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-white/40" />
                
                {/* Efecto de movimiento cuando está girando */}
                {phase === 'spinning' && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-spin" />
                )}
                
                {/* Estela de movimiento en rebotes */}
                {phase === 'bouncing' && (
                  <>
                    <div className="absolute -inset-1 rounded-full bg-white/30 animate-ping" />
                    <div className="absolute -inset-0.5 rounded-full border border-white/50 animate-pulse" />
                  </>
                )}
                
                {/* Efecto de asentamiento */}
                {phase === 'settled' && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/30 via-transparent to-transparent animate-pulse" />
                )}
              </div>
              
              {/* Sombra dinámica de la bola */}
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-1 bg-black/30 rounded-full blur-sm transition-all duration-150"
                style={{
                  transform: `translateX(-50%) scaleX(${ballRadius / 240}) scaleY(${phase === 'bouncing' ? '0.5' : '1'})`,
                  opacity: phase === 'settled' ? 0.6 : 0.3
                }}
              />
            </div>
          </div>
          
          {/* Deflector triangular mejorado - marca la posición ganadora */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-20">
            <div className="relative">
              {/* Deflector principal */}
              <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-gradient-to-b from-yellow-400 to-yellow-600 drop-shadow-lg" />
              
              {/* Efecto de brillo */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-300 opacity-60" />
              
              {/* Punto de luz en la punta */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-200 rounded-full shadow-sm animate-pulse" />
            </div>
          </div>
          
          {/* Efectos de iluminación de casino mejorados */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/15 via-transparent to-amber-600/10 pointer-events-none" />
          <div className="absolute inset-12 rounded-full bg-gradient-to-tl from-white/8 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-20 rounded-full bg-gradient-to-br from-yellow-300/5 via-transparent to-transparent pointer-events-none" />
          
          {/* Anillo de luz cuando está girando mejorado */}
          {isSpinning && (
            <>
              <div className="absolute inset-8 rounded-full border-2 border-yellow-400/40 animate-pulse" />
              <div className="absolute inset-12 rounded-full border border-yellow-300/30 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent animate-spin" style={{ animationDuration: '3s' }} />
            </>
          )}
          
          {/* Efecto de victoria */}
          {phase === 'settled' && winningNumber !== null && (
            <>
              <div className="absolute inset-4 rounded-full border-4 border-yellow-400/60 animate-pulse" />
              <div className="absolute inset-8 rounded-full border-2 border-yellow-300/40 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-600/20 animate-pulse" />
            </>
          )}
        </div>
        
        {/* Información del estado */}
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
                {[...Array(Math.min(bounceCount, 10))].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          )}
          
          {phase === 'settled' && winningNumber !== null && (
            <div className="text-center space-y-4">
              <p className="text-2xl text-green-400 font-bold">🎯 ¡Número Ganador! 🎯</p>
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold text-white shadow-2xl border-4 transform animate-pulse
                ${getNumberColor(winningNumber) === 'red' 
                  ? 'bg-gradient-to-br from-red-500 to-red-700 border-red-300' 
                  : getNumberColor(winningNumber) === 'black' 
                  ? 'bg-gradient-to-br from-gray-800 to-black border-gray-400' 
                  : 'bg-gradient-to-br from-green-500 to-green-700 border-green-300'}`}
              >
                {winningNumber}
              </div>
              <p className="text-lg text-gray-300">
                Color: <span className={`font-bold ${getNumberColor(winningNumber) === 'red' ? 'text-red-400' : getNumberColor(winningNumber) === 'black' ? 'text-gray-300' : 'text-green-400'}`}>
                  {getNumberColor(winningNumber) === 'red' ? 'ROJO' : getNumberColor(winningNumber) === 'black' ? 'NEGRO' : 'VERDE'}
                </span>
              </p>
            </div>
          )}
          
          {phase === 'idle' && !isSpinning && (
            <p className="text-xl text-gray-400 font-medium">Esperando próxima jugada...</p>
          )}
        </div>
        
        {/* Estadísticas de la jugada */}
        {phase !== 'idle' && (
          <div className="absolute top-4 left-4 text-white/70 text-sm font-mono space-y-1">
            <div>Velocidad bola: {ballSpeed.toFixed(1)}</div>
            <div>Radio: {ballRadius.toFixed(0)}px</div>
            <div>Fase: {phase}</div>
            {bounceCount > 0 && <div>Rebotes: {bounceCount}</div>}
          </div>
        )}
      </Card>
      
      {/* Efectos de partículas para celebración mejorados */}
      {phase === 'settled' && winningNumber !== null && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Partículas principales */}
          {[...Array(30)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full animate-ping"
              style={{
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                backgroundColor: getNumberColor(winningNumber!) === 'red' ? '#ef4444' : getNumberColor(winningNumber!) === 'black' ? '#6b7280' : '#22c55e',
                top: `${15 + Math.random() * 70}%`,
                left: `${15 + Math.random() * 70}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: `${2 + Math.random() * 2}s`,
                opacity: 0.7
              }}
            />
          ))}
          
          {/* Estrellas doradas */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute text-yellow-400 animate-bounce"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 150}ms`,
                animationDuration: '2.5s',
                fontSize: `${12 + Math.random() * 8}px`
              }}
            >
              ✨
            </div>
          ))}
          
          {/* Ondas de expansión */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`wave-${i}`}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 rounded-full animate-ping"
              style={{
                width: `${100 + i * 80}px`,
                height: `${100 + i * 80}px`,
                borderColor: getNumberColor(winningNumber!) === 'red' ? '#fca5a5' : getNumberColor(winningNumber!) === 'black' ? '#d1d5db' : '#86efac',
                animationDelay: `${i * 200}ms`,
                animationDuration: '3s',
                opacity: 0.3
              }}
            />
          ))}
          
          {/* Rayos de luz */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`ray-${i}`}
              className="absolute top-1/2 left-1/2 w-1 bg-gradient-to-t from-yellow-400 to-transparent animate-pulse"
              style={{
                height: '150px',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-75px)`,
                transformOrigin: 'center bottom',
                animationDelay: `${i * 100}ms`,
                animationDuration: '2s',
                opacity: 0.6
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}