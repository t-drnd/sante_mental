'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatTime } from '@/lib/utils'

interface Session {
  id: string
  date: string
  duration: number
  type: string
  notes: string | null
}

interface SessionListProps {
  refreshKey?: number
}

export function SessionList({ refreshKey }: SessionListProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [refreshKey])

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/meditation')
      if (res.ok) {
        const data = await res.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalMinutes} min
            </div>
            <p className="text-sm text-gray-600">Total de méditation</p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Historique des sessions</h3>
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Aucune session enregistrée
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{formatDate(session.date)}</span>
                        <span className="text-sm text-purple-600 font-medium">
                          {formatTime(session.duration)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{session.type}</p>
                      {session.notes && (
                        <p className="text-sm text-gray-700 mt-2">{session.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

