'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const emotions = [
  { emoji: '😊', label: 'Heureux', value: 'happy' },
  { emoji: '😌', label: 'Calme', value: 'calm' },
  { emoji: '😢', label: 'Triste', value: 'sad' },
  { emoji: '😰', label: 'Anxieux', value: 'anxious' },
  { emoji: '😠', label: 'En colère', value: 'angry' },
  { emoji: '😴', label: 'Fatigué', value: 'tired' },
  { emoji: '🤔', label: 'Pensif', value: 'thoughtful' },
  { emoji: '😍', label: 'Amoureux', value: 'loving' },
]

export default function CheckinPage() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleQuickCheckin = async () => {
    if (!selectedEmotion || moodScore === null) return

    setLoading(true)
    try {
      const res = await fetch('/api/journal/quick-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodScore,
          emotion: selectedEmotion,
        }),
      })

      if (res.ok) {
        setSelectedEmotion(null)
        setMoodScore(null)
        alert('Check-in enregistré !')
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Check-in rapide
        </h1>
        <p className="text-[#a0a0a0] mt-2">Comment te sens-tu en ce moment ?</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ton humeur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
              <button
                key={score}
                onClick={() => setMoodScore(score)}
                className={`w-12 h-12 rounded-full transition-all ${
                  moodScore === score
                    ? 'bg-purple-600 text-white scale-110'
                    : 'bg-[#1a1a1a] text-[#a0a0a0] hover:bg-[#2a2a2a]'
                }`}
              >
                {score}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ton émotion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {emotions.map((emotion) => (
              <button
                key={emotion.value}
                onClick={() => setSelectedEmotion(emotion.value)}
                className={`p-4 rounded-lg transition-all ${
                  selectedEmotion === emotion.value
                    ? 'bg-purple-600/20 border-2 border-purple-500'
                    : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-purple-500/50'
                }`}
              >
                <div className="text-4xl mb-2">{emotion.emoji}</div>
                <div className="text-sm text-[#a0a0a0]">{emotion.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={handleQuickCheckin}
          disabled={!selectedEmotion || moodScore === null || loading}
          className="px-8 py-3 text-lg"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </div>
  )
}

