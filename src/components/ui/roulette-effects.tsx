'use client'

import React from 'react'

interface SpinEffectProps {
  visible: boolean
}

export const SpinEffect: React.FC<SpinEffectProps> = ({ visible }) => {
  if (!visible) return null
  
  return (
    <>
      <div className="absolute inset-8 rounded-full border-2 border-yellow-400/40 animate-pulse" />
      <div className="absolute inset-12 rounded-full border border-yellow-300/30 animate-ping" />
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent animate-spin"
        style={{ animationDuration: '3s' }}
      />
    </>
  )
}

export const SettleEffect: React.FC<SpinEffectProps> = ({ visible }) => {
  if (!visible) return null
  
  return (
    <>
      <div className="absolute inset-4 rounded-full border-4 border-yellow-400/60 animate-pulse" />
      <div className="absolute inset-8 rounded-full border-2 border-yellow-300/40 animate-ping" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 via-transparent to-yellow-600/20 animate-pulse" />
    </>
  )
}

interface BallEffectProps {
  phase: 'spinning' | 'bouncing' | 'settled'
}

export const BallEffect: React.FC<BallEffectProps> = ({ phase }) => {
  if (phase === 'spinning') {
    return (
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-spin" />
    )
  }
  
  if (phase === 'bouncing') {
    return (
      <>
        <div className="absolute -inset-1 rounded-full bg-white/30 animate-ping" />
        <div className="absolute -inset-0.5 rounded-full border border-white/50 animate-pulse" />
      </>
    )
  }
  
  if (phase === 'settled') {
    return (
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/30 via-transparent to-transparent animate-pulse" />
    )
  }
  
  return null
}
