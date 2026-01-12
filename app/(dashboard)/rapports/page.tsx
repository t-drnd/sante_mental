'use client'

import { useState, useEffect } from 'react'
import { WeeklyReport } from '@/components/rapports/weekly-report'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function RapportsPage() {
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const generateAISummary = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/weekly-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekOffset: 0 }),
      })

      if (res.ok) {
        const data = await res.json()
        setAiSummary(data.summary)
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch('/api/analytics/insights')
      .then((res) => res.json())
      .then((data) => setInsights(data.patterns || []))
      .catch((err) => console.error('Erreur:', err))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          Rapports hebdomadaires
        </h1>
        <p className="text-[#a0a0a0] mt-2">
          Analysez votre bien-être et votre productivité
        </p>
      </div>

      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Insights détectés</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.map((insight, idx) => (
                <li key={idx} className="text-[#f5f5f5] flex items-start">
                  <span className="mr-2">💡</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Résumé hebdomadaire IA</CardTitle>
            <Button onClick={generateAISummary} disabled={loading}>
              {loading ? 'Génération...' : 'Générer le résumé'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {aiSummary ? (
            <p className="text-[#e0e0e0] whitespace-pre-wrap">{aiSummary}</p>
          ) : (
            <p className="text-[#a0a0a0]">
              Clique sur "Générer le résumé" pour obtenir un résumé IA de ta semaine
            </p>
          )}
        </CardContent>
      </Card>

      <WeeklyReport />
    </div>
  )
}

