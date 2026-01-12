'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type BreathingPattern = '4-7-8' | '5-5-5' | '4-4-4'

const patterns = {
  '4-7-8': { inhale: 4, hold: 7, exhale: 8, name: '4-7-8 (Relaxation)' },
  '5-5-5': { inhale: 5, hold: 5, exhale: 5, name: '5-5-5 (Équilibre)' },
  '4-4-4': { inhale: 4, hold: 4, exhale: 4, name: '4-4-4 (Cohérence cardiaque)' },
}

export default function RespirationPage() {
  const [pattern, setPattern] = useState<BreathingPattern>('4-7-8')
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [countdown, setCountdown] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [duration, setDuration] = useState(0)

  const currentPattern = patterns[pattern]

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)
      setCountdown((prev) => {
        if (prev <= 1) {
          if (phase === 'inhale') {
            setPhase('hold')
            return currentPattern.hold
          } else if (phase === 'hold') {
            setPhase('exhale')
            return currentPattern.exhale
          } else {
            setCycles((prev) => prev + 1)
            setPhase('inhale')
            return currentPattern.inhale
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phase, currentPattern])

  const startBreathing = () => {
    setIsActive(true)
    setPhase('inhale')
    setCountdown(currentPattern.inhale)
    setCycles(0)
    setDuration(0)
  }

  const stopBreathing = async () => {
    setIsActive(false)
    if (cycles > 0) {
      try {
        await fetch('/api/meditation/breathing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pattern,
            cycles,
            duration,
          }),
        })
      } catch (err) {
        console.error('Erreur:', err)
      }
    }
  }

  const getCircleSize = () => {
    if (phase === 'inhale') {
      return 100 + (currentPattern.inhale - countdown) * 20
    } else if (phase === 'hold') {
      return 200
    } else {
      return 200 - (currentPattern.exhale - countdown) * 20
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Respiration guidée
        </h1>
        <p className="text-[#a0a0a0] mt-2">Pratique la cohérence cardiaque</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Choisis un rythme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(patterns).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    setPattern(key as BreathingPattern)
                    setIsActive(false)
                  }}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    pattern === key
                      ? 'bg-purple-600/20 border-2 border-purple-500'
                      : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-purple-500/50'
                  }`}
                >
                  <div className="font-semibold text-[#f5f5f5]">{value.name}</div>
                  <div className="text-sm text-[#a0a0a0]">
                    Inspirer {value.inhale}s - Retenir {value.hold}s - Expirer {value.exhale}s
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div
                className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 transition-all duration-1000 ease-in-out flex items-center justify-center text-white text-2xl font-bold"
                style={{
                  width: `${getCircleSize()}px`,
                  height: `${getCircleSize()}px`,
                }}
              >
                {phase === 'inhale' && 'Inspire'}
                {phase === 'hold' && 'Retiens'}
                {phase === 'exhale' && 'Expire'}
              </div>
              <div className="mt-8 text-4xl font-bold text-purple-400">{countdown}</div>
              <div className="mt-4 text-[#a0a0a0]">Cycles: {cycles}</div>
              <div className="mt-2 text-[#a0a0a0]">Durée: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</div>
              <div className="mt-6">
                {!isActive ? (
                  <Button onClick={startBreathing} className="px-8">
                    Commencer
                  </Button>
                ) : (
                  <Button onClick={stopBreathing} variant="outline" className="px-8">
                    Arrêter
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

