'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Affirmation {
  id: number
  text: string
  category: string | null
  isActive: boolean
}

export default function AffirmationsPage() {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([])
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAffirmations()
  }, [])

  const fetchAffirmations = async () => {
    try {
      const res = await fetch('/api/affirmations')
      if (res.ok) {
        const data = await res.json()
        setAffirmations(data)
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/affirmations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          category: category || null,
        }),
      })

      if (res.ok) {
        setText('')
        setCategory('')
        setShowForm(false)
        fetchAffirmations()
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  const activeAffirmations = affirmations.filter((a) => a.isActive)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Affirmations positives
          </h1>
          <p className="text-[#a0a0a0] mt-2">Crée tes propres affirmations</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : '+ Nouvelle affirmation'}
        </Button>
      </div>

      {activeAffirmations.length > 0 && (
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
          <CardContent className="py-12 text-center">
            <p className="text-2xl font-semibold text-[#f5f5f5]">
              {activeAffirmations[Math.floor(Math.random() * activeAffirmations.length)].text}
            </p>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle affirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Ton affirmation positive (ex: Je suis capable de surmonter tous les défis)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="min-h-[100px]"
              />
              <input
                type="text"
                placeholder="Catégorie (optionnel)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#2a2a2a] bg-[#111111] text-[#f5f5f5]"
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {affirmations.map((affirmation) => (
          <Card key={affirmation.id}>
            <CardContent className="p-6">
              <p className="text-[#f5f5f5] mb-4">{affirmation.text}</p>
              <div className="flex justify-between items-center">
                {affirmation.category && (
                  <span className="text-xs text-[#a0a0a0] bg-[#1a1a1a] px-2 py-1 rounded">
                    {affirmation.category}
                  </span>
                )}
                <span className={`text-xs px-2 py-1 rounded ${
                  affirmation.isActive
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {affirmation.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {affirmations.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-[#a0a0a0]">Aucune affirmation pour le moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

