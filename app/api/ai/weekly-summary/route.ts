import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { callOpenAI } from '@/lib/openai'
import { AI_PROMPTS, buildWeeklySummaryPrompt } from '@/lib/ai-prompts'
import { db, schema } from '@/lib/db'
import { eq, and, gte, lte } from 'drizzle-orm'
import { startOfWeek, endOfWeek, subWeeks } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const weekOffset = body.weekOffset || 0

    const userId = parseInt(session.user.id)
    const targetDate = new Date()
    const weekStart = startOfWeek(subWeeks(targetDate, weekOffset), {
      weekStartsOn: 1,
    })
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })

    const [journalEntries, meditationSessions, productivityEntries] =
      await Promise.all([
        db
          .select()
          .from(schema.journalEntriesTable)
          .where(
            and(
              eq(schema.journalEntriesTable.userId, userId),
              gte(schema.journalEntriesTable.date, weekStart),
              lte(schema.journalEntriesTable.date, weekEnd)
            )
          ),
        db
          .select()
          .from(schema.meditationSessionsTable)
          .where(
            and(
              eq(schema.meditationSessionsTable.userId, userId),
              gte(schema.meditationSessionsTable.date, weekStart),
              lte(schema.meditationSessionsTable.date, weekEnd)
            )
          ),
        db
          .select()
          .from(schema.productivityEntriesTable)
          .where(
            and(
              eq(schema.productivityEntriesTable.userId, userId),
              gte(schema.productivityEntriesTable.date, weekStart),
              lte(schema.productivityEntriesTable.date, weekEnd)
            )
          ),
      ])

    const weeklyData = {
      journalEntries: journalEntries.length,
      averageMood:
        journalEntries.length > 0
          ? journalEntries.reduce((sum, e) => sum + e.moodScore, 0) /
            journalEntries.length
          : null,
      meditationSessions: meditationSessions.length,
      totalMeditationMinutes: meditationSessions.reduce(
        (sum, m) => sum + m.duration,
        0
      ),
      productivityTasks: productivityEntries.length,
      completedTasks: productivityEntries.filter((t) => t.completed).length,
    }

    const prompt = buildWeeklySummaryPrompt(weeklyData)
    const summary = await callOpenAI(prompt, AI_PROMPTS.weeklySummary.system)

    if (!summary) {
      return NextResponse.json(
        { error: 'Erreur lors de la génération du résumé' },
        { status: 500 }
      )
    }

    return NextResponse.json({ summary, data: weeklyData })
  } catch (err) {
    console.error('Erreur résumé hebdomadaire:', err)
    return NextResponse.json(
      { error: 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}

