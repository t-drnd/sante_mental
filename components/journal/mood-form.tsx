'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface MoodFormProps {
  date?: Date
  initialData?: {
    moodScore?: number
    emotion?: string
    notes?: string
  }
  onSuccess?: () => void
}

export function MoodForm({ date, initialData, onSuccess }: MoodFormProps) {
  const [moodScore, setMoodScore] = useState(initialData?.moodScore || 5)
  const [emotion, setEmotion] = useState(initialData?.emotion || '')
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date?.toISOString(),
          moodScore,
          emotion: emotion || undefined,
          notes: notes || undefined,
        }),
      })

      if (res.ok) {
        if (onSuccess) onSuccess()
      } else {
        const data = await res.json()
        setError(data.error || 'Erreur lors de l\'enregistrement')
      }
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comment vous sentez-vous aujourd'hui ?</CardTitle>
        <CardDescription>
          Évaluez votre humeur sur une échelle de 1 à 10
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Score d'humeur: {moodScore}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Très bas</span>
              <span>Très bien</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="emotion" className="text-sm font-medium">
              Émotion principale (optionnel)
            </label>
            <Input
              id="emotion"
              type="text"
              placeholder="ex: joyeux, calme, anxieux..."
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes (optionnel)
            </label>
            <Textarea
              id="notes"
              placeholder="Comment vous sentez-vous ? Qu'est-ce qui influence votre humeur aujourd'hui ?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

