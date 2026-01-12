'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Habit {
  id: number
  title: string
  description: string | null
  streak: number
  longestStreak: number
  status: 'active' | 'completed' | 'skipped'
}

export default function HabitudesPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const res = await fetch('/api/habits')
      if (res.ok) {
        const data = await res.json()
        setHabits(data)
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
        }),
      })

      if (res.ok) {
        setTitle('')
        setDescription('')
        setShowForm(false)
        fetchHabits()
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (habitId: number) => {
    try {
      const res = await fetch(`/api/habits/${habitId}/complete`, {
        method: 'POST',
      })

      if (res.ok) {
        fetchHabits()
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Micro-habitudes
          </h1>
          <p className="text-[#a0a0a0] mt-2">Une action simple par jour</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : '+ Nouvelle habitude'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle micro-habitude</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Titre de l'habitude (ex: Boire un verre d'eau le matin)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Description (optionnel)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <Card key={habit.id}>
            <CardHeader>
              <CardTitle>{habit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {habit.description && (
                <p className="text-sm text-[#a0a0a0] mb-4">{habit.description}</p>
              )}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{habit.streak}</div>
                    <div className="text-xs text-[#a0a0a0]">Jours consécutifs</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#a0a0a0]">Meilleur streak</div>
                    <div className="text-lg font-semibold text-[#f5f5f5]">{habit.longestStreak}</div>
                  </div>
                </div>
                <Button
                  onClick={() => handleComplete(habit.id)}
                  className="w-full"
                  disabled={habit.status === 'completed'}
                >
                  {habit.status === 'completed' ? '✓ Complété aujourd\'hui' : 'Marquer comme fait'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {habits.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-[#a0a0a0]">Aucune habitude pour le moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

