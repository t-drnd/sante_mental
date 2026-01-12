'use client'

import { useState, useEffect } from 'react'
import { MoodForm } from '@/components/journal/mood-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

interface JournalEntry {
  id: string
  date: string
  moodScore: number
  emotion: string | null
  notes: string | null
}

export default function JournalPage() {
  const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null)
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchEntries()
  }, [refreshKey])

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/journal')
      if (res.ok) {
        const entries: JournalEntry[] = await res.json()
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const todayEntryData = entries.find((e) => {
          const entryDate = new Date(e.date)
          entryDate.setHours(0, 0, 0, 0)
          return entryDate.getTime() === today.getTime()
        })
        
        setTodayEntry(todayEntryData || null)
        setRecentEntries(entries.slice(0, 10))
      }
    } catch (error) {
      console.error('Erreur lors de la récupération:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Journal quotidien
        </h1>
        <p className="text-[#a0a0a0] mt-2">Consignez votre humeur et vos émotions</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MoodForm 
          date={new Date()} 
          initialData={todayEntry ? {
            moodScore: todayEntry.moodScore,
            emotion: todayEntry.emotion || undefined,
            notes: todayEntry.notes || undefined,
          } : undefined} 
          onSuccess={handleSuccess} 
        />

        <Card>
          <CardHeader>
            <CardTitle>Historique récent</CardTitle>
            <CardDescription>Vos 10 dernières entrées</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEntries.length > 0 ? (
              <div className="space-y-4">
                {recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border-b border-[#1f1f1f] pb-4 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#f5f5f5]">{formatDate(entry.date)}</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        {entry.moodScore}/10
                      </span>
                    </div>
                    {entry.emotion && (
                      <p className="text-sm text-[#a0a0a0] mb-1">
                        Émotion: {entry.emotion}
                      </p>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-[#e0e0e0]">{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#a0a0a0] text-center py-8">
                Aucune entrée récente. Commencez à enregistrer votre humeur !
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
