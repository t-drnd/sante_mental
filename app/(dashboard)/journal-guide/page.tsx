'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const dailyQuestions = [
  {
    type: 'gratitude',
    question: 'Pour quoi es-tu reconnaissant aujourd\'hui ?',
    placeholder: 'Écris trois choses pour lesquelles tu es reconnaissant...',
  },
  {
    type: 'emotions',
    question: 'Comment te sens-tu en ce moment ?',
    placeholder: 'Décris tes émotions actuelles...',
  },
  {
    type: 'challenges',
    question: 'Quels défis as-tu rencontrés aujourd\'hui ?',
    placeholder: 'Parle des difficultés que tu as rencontrées...',
  },
]

export default function JournalGuidePage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const currentQuestion = dailyQuestions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestion.type] || ''

  const handleNext = () => {
    if (currentQuestionIndex < dailyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/journal/guided', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: dailyQuestions.map((q) => ({
            questionType: q.type,
            question: q.question,
            answer: answers[q.type] || '',
          })),
        }),
      })

      if (res.ok) {
        setAnswers({})
        setCurrentQuestionIndex(0)
        alert('Journal guidé enregistré !')
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Journal guidé
        </h1>
        <p className="text-[#a0a0a0] mt-2">Réponds aux questions du jour</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{currentQuestion.question}</CardTitle>
            <span className="text-sm text-[#a0a0a0]">
              {currentQuestionIndex + 1} / {dailyQuestions.length}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={currentAnswer}
            onChange={(e) =>
              setAnswers({ ...answers, [currentQuestion.type]: e.target.value })
            }
            placeholder={currentQuestion.placeholder}
            className="min-h-[200px] mb-4"
          />

          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              Précédent
            </Button>
            {currentQuestionIndex < dailyQuestions.length - 1 ? (
              <Button onClick={handleNext}>Suivant</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Enregistrement...' : 'Terminer'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

