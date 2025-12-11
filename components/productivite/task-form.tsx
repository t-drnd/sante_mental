'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TaskFormProps {
  onSuccess?: () => void
}

export function TaskForm({ onSuccess }: TaskFormProps) {
  const [task, setTask] = useState('')
  const [description, setDescription] = useState('')
  const [timeSpent, setTimeSpent] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/productivite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          description: description || undefined,
          timeSpent: timeSpent ? parseInt(timeSpent) : undefined,
          priority,
        }),
      })

      if (res.ok) {
        setTask('')
        setDescription('')
        setTimeSpent('')
        setPriority('medium')
        if (onSuccess) onSuccess()
      } else {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la création de la tâche')
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
        <CardTitle>Nouvelle tâche</CardTitle>
        <CardDescription>Ajoutez une tâche à votre liste</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="task" className="text-sm font-medium">
              Tâche *
            </label>
            <Input
              id="task"
              type="text"
              placeholder="Nom de la tâche"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optionnel)
            </label>
            <Textarea
              id="description"
              placeholder="Détails de la tâche"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="timeSpent" className="text-sm font-medium">
                Temps passé (minutes)
              </label>
              <Input
                id="timeSpent"
                type="number"
                placeholder="0"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priorité
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer la tâche'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

