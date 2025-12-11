'use client'

import { useState } from 'react'
import { MeditationTimer } from '@/components/meditation/meditation-timer'
import { SessionList } from '@/components/meditation/session-list'

export default function MeditationPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSessionSaved = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Méditation</h1>
        <p className="text-gray-600">Pratiquez la méditation et suivez vos sessions</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MeditationTimer onSessionSaved={handleSessionSaved} />
        <SessionList key={refreshKey} />
      </div>
    </div>
  )
}
