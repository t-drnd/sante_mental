'use client'

import { useState } from 'react'
import { TaskForm } from '@/components/productivite/task-form'
import { TaskList } from '@/components/productivite/task-list'

export default function ProductivitePage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Productivité
        </h1>
        <p className="text-[#a0a0a0] mt-2">Gérez vos tâches et suivez votre productivité</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TaskForm onSuccess={handleSuccess} />
        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#f5f5f5]">Mes tâches</h2>
          <TaskList key={refreshKey} />
        </div>
      </div>
    </div>
  )
}
