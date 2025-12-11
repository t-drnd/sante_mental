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
        <h1 className="text-3xl font-bold">Productivité</h1>
        <p className="text-gray-600">Gérez vos tâches et suivez votre productivité</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TaskForm onSuccess={handleSuccess} />
        <div>
          <h2 className="text-xl font-semibold mb-4">Mes tâches</h2>
          <TaskList key={refreshKey} />
        </div>
      </div>
    </div>
  )
}
