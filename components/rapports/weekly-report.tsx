'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { formatDate } from '@/lib/utils'
import { format, startOfWeek, endOfWeek } from 'date-fns'

interface WeeklyReportData {
  weekStart: string
  weekEnd: string
  averageMoodScore: number | null
  totalMeditationMinutes: number | null
  totalProductivityTasks: number | null
  completedTasks: number | null
  insights: string | null
  recommendations: string | null
}

export function WeeklyReport() {
  const [report, setReport] = useState<WeeklyReportData | null>(null)
  const [moodData, setMoodData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)

  useEffect(() => {
    fetchReport()
    fetchMoodData()
  }, [weekOffset])

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/rapports?weekOffset=${weekOffset}`)
      if (res.ok) {
        const data = await res.json()
        setReport(data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMoodData = async () => {
    try {
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() - weekOffset * 7)
      const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })

      const res = await fetch(
        `/api/journal?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`
      )
      if (res.ok) {
        const entries = await res.json()
        const formatted = entries.map((entry: any) => ({
          date: format(new Date(entry.date), 'EEE'),
          score: entry.moodScore,
          fullDate: format(new Date(entry.date), 'dd/MM'),
        }))
        setMoodData(formatted)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement du rapport...</div>
  }

  if (!report) {
    return <div className="text-center py-8 text-gray-500">Aucun rapport disponible</div>
  }

  const weekStartDate = format(new Date(report.weekStart), 'dd MMMM yyyy')
  const weekEndDate = format(new Date(report.weekEnd), 'dd MMMM yyyy')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rapport hebdomadaire</h2>
          <p className="text-gray-600">
            {weekStartDate} - {weekEndDate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekOffset(weekOffset + 1)}
          >
            Semaine précédente
          </Button>
          {weekOffset > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekOffset(weekOffset - 1)}
            >
              Semaine suivante
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Humeur moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {report.averageMoodScore !== null
                ? report.averageMoodScore.toFixed(1)
                : 'N/A'}
              {report.averageMoodScore !== null && '/10'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Méditation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {report.totalMeditationMinutes || 0} min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tâches complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {report.completedTasks || 0}/{report.totalProductivityTasks || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Taux de complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {report.totalProductivityTasks && report.completedTasks
                ? Math.round(
                    (report.completedTasks / report.totalProductivityTasks) * 100
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {moodData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Évolution de l'humeur</CardTitle>
            <CardDescription>Score d'humeur au cours de la semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Score d'humeur"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {report.insights && (
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{report.insights}</p>
            </CardContent>
          </Card>
        )}

        {report.recommendations && (
          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">
                {report.recommendations}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

