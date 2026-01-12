'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const sounds = [
  { id: 'rain', name: 'Pluie', emoji: '🌧️' },
  { id: 'ocean', name: 'Océan', emoji: '🌊' },
  { id: 'forest', name: 'Forêt', emoji: '🌲' },
  { id: 'white-noise', name: 'Bruit blanc', emoji: '🔊' },
  { id: 'fire', name: 'Feu de cheminée', emoji: '🔥' },
  { id: 'birds', name: 'Oiseaux', emoji: '🐦' },
]

export default function SonsPage() {
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set())
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying])

  const toggleSound = (soundId: string) => {
    const newActiveSounds = new Set(activeSounds)
    
    if (newActiveSounds.has(soundId)) {
      newActiveSounds.delete(soundId)
      const audio = audioRefs.current[soundId]
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    } else {
      newActiveSounds.add(soundId)
      const audio = new Audio(`/sounds/${soundId}.mp3`)
      audio.loop = true
      audio.volume = 0.5
      audioRefs.current[soundId] = audio
      audio.play()
    }

    setActiveSounds(newActiveSounds)
    setIsPlaying(newActiveSounds.size > 0)
  }

  const stopAll = async () => {
    activeSounds.forEach((soundId) => {
      const audio = audioRefs.current[soundId]
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    })

    if (duration > 0) {
      try {
        await fetch('/api/meditation/sound', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            soundType: Array.from(activeSounds).join(','),
            duration,
          }),
        })
      } catch (err) {
        console.error('Erreur:', err)
      }
    }

    setActiveSounds(new Set())
    setIsPlaying(false)
    setDuration(0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Sons relaxants
        </h1>
        <p className="text-[#a0a0a0] mt-2">Choisis tes sons pour te détendre</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sons disponibles</CardTitle>
            {isPlaying && (
              <div className="text-[#a0a0a0]">
                Durée: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className={`p-6 rounded-lg transition-all ${
                  activeSounds.has(sound.id)
                    ? 'bg-blue-600/20 border-2 border-blue-500'
                    : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-blue-500/50'
                }`}
              >
                <div className="text-5xl mb-2">{sound.emoji}</div>
                <div className="text-sm text-[#f5f5f5]">{sound.name}</div>
                {activeSounds.has(sound.id) && (
                  <div className="text-xs text-blue-400 mt-2">● En cours</div>
                )}
              </button>
            ))}
          </div>
          {isPlaying && (
            <div className="mt-6 flex justify-center">
              <Button onClick={stopAll} variant="outline">
                Arrêter tout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#a0a0a0]">
            Les fichiers audio doivent être placés dans le dossier <code className="bg-[#1a1a1a] px-2 py-1 rounded">public/sounds/</code> avec les noms suivants : rain.mp3, ocean.mp3, forest.mp3, white-noise.mp3, fire.mp3, birds.mp3
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

