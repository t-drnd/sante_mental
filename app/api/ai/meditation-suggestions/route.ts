import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { callOpenAI } from '@/lib/openai'
import { AI_PROMPTS, buildMeditationSuggestionPrompt } from '@/lib/ai-prompts'
import { db, schema } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)

    const recentEntries = await db
      .select()
      .from(schema.journalEntriesTable)
      .where(eq(schema.journalEntriesTable.userId, userId))
      .orderBy(desc(schema.journalEntriesTable.date))
      .limit(5)

    const currentMood = recentEntries[0]?.moodScore || 5
    const currentEmotion = recentEntries[0]?.emotion || undefined

    const prompt = buildMeditationSuggestionPrompt(
      currentMood,
      currentEmotion,
      recentEntries
    )

    const suggestion = await callOpenAI(prompt, AI_PROMPTS.meditationSuggestion.system)

    if (!suggestion) {
      return NextResponse.json(
        { error: 'Erreur lors de la génération de la suggestion' },
        { status: 500 }
      )
    }

    return NextResponse.json({ suggestion })
  } catch (err) {
    console.error('Erreur suggestion méditation:', err)
    return NextResponse.json(
      { error: 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}

