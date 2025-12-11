'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatTime } from '@/lib/utils'

interface Task {
  id: string
  task: string
  description: string | null
  timeSpent: number | null
  completed: boolean
  priority: string | null
  date: string
}

interface TaskListProps {
  refreshKey?: number
}

export function TaskList({ refreshKey }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/productivite')
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [refreshKey])

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const res = await fetch('/api/productivite', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !completed }),
      })

      if (res.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const deleteTask = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return

    try {
      const res = await fetch(`/api/productivite?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  })

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Toutes
        </Button>
        <Button
          variant={filter === 'pending' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          En cours
        </Button>
        <Button
          variant={filter === 'completed' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Complétées
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Aucune tâche {filter !== 'all' && filter === 'completed' ? 'complétée' : 'en cours'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <Card key={task.id} className={task.completed ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id, task.completed)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <h3
                        className={`font-medium ${
                          task.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {task.task}
                      </h3>
                      {task.priority && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            priorityColors[task.priority as keyof typeof priorityColors] ||
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {task.priority === 'high'
                            ? 'Haute'
                            : task.priority === 'medium'
                            ? 'Moyenne'
                            : 'Basse'}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 ml-6">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 ml-6 mt-2 text-xs text-gray-500">
                      <span>{formatDate(task.date)}</span>
                      {task.timeSpent && (
                        <span>⏱️ {formatTime(task.timeSpent)}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

