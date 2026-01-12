import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { callOpenAI } from '@/lib/openai'
import { AI_PROMPTS, buildDailyChatPrompt } from '@/lib/ai-prompts'
import { db, schema } from '@/lib/db'
import { eq, and, gte, lte } from 'drizzle-orm'
import { startOfDay, endOfDay } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    const userId = parseInt(session.user.id)
    const today = new Date()
    const todayStart = startOfDay(today)
    const todayEnd = endOfDay(today)

    const [todayJournal, todayTasks, todayMeditation] = await Promise.all([
      db
        .select()
        .from(schema.journalEntriesTable)
        .where(
          and(
            eq(schema.journalEntriesTable.userId, userId),
            gte(schema.journalEntriesTable.date, todayStart),
            lte(schema.journalEntriesTable.date, todayEnd)
          )
        )
        .limit(1)
        .then((results) => results[0] || null),
      db
        .select()
        .from(schema.productivityEntriesTable)
        .where(
          and(
            eq(schema.productivityEntriesTable.userId, userId),
            gte(schema.productivityEntriesTable.date, todayStart),
            lte(schema.productivityEntriesTable.date, todayEnd)
          )
        ),
      db
        .select()
        .from(schema.meditationSessionsTable)
        .where(
          and(
            eq(schema.meditationSessionsTable.userId, userId),
            gte(schema.meditationSessionsTable.date, todayStart),
            lte(schema.meditationSessionsTable.date, todayEnd)
          )
        )
        .limit(1)
        .then((results) => results[0] || null),
    ])

    const dailyContext = {
      mood: todayJournal?.moodScore || null,
      emotion: todayJournal?.emotion || null,
      tasksCompleted: todayTasks.filter((t) => t.completed).length,
      totalTasks: todayTasks.length,
      meditation: todayMeditation ? { duration: todayMeditation.duration, type: todayMeditation.type } : null,
    }

    const prompt = buildDailyChatPrompt(message, dailyContext)
    const response = await callOpenAI(prompt, AI_PROMPTS.dailyChat.system)

    if (!response) {
      return NextResponse.json(
        { error: 'Erreur lors de la génération de la réponse' },
        { status: 500 }
      )
    }

    await db.insert(schema.aiConversationsTable).values({
      userId,
      type: 'daily-chat',
      messages: JSON.stringify([{ role: 'user', content: message }, { role: 'assistant', content: response }]),
      context: JSON.stringify(dailyContext),
    })

    return NextResponse.json({ response })
  } catch (err) {
    console.error('Erreur chat quotidien:', err)
    return NextResponse.json(
      { error: 'Erreur lors de la communication' },
      { status: 500 }
    )
  }
}

