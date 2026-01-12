import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { callOpenAI } from '@/lib/openai'
import { AI_PROMPTS, buildCoachPrompt } from '@/lib/ai-prompts'
import { db, schema } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'

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

    const recentEntries = await db
      .select()
      .from(schema.journalEntriesTable)
      .where(eq(schema.journalEntriesTable.userId, userId))
      .orderBy(desc(schema.journalEntriesTable.date))
      .limit(5)

    const context = recentEntries.length > 0
      ? `Historique récent de l'utilisateur : ${JSON.stringify(recentEntries)}`
      : undefined

    const prompt = buildCoachPrompt(message, context)
    const response = await callOpenAI(prompt, AI_PROMPTS.coach.system)

    if (!response) {
      return NextResponse.json(
        { error: 'Erreur lors de la génération de la réponse' },
        { status: 500 }
      )
    }

    await db.insert(schema.aiConversationsTable).values({
      userId,
      type: 'coach',
      messages: JSON.stringify([{ role: 'user', content: message }, { role: 'assistant', content: response }]),
      context: context || null,
    })

    return NextResponse.json({ response })
  } catch (err) {
    console.error('Erreur coach IA:', err)
    return NextResponse.json(
      { error: 'Erreur lors de la communication avec le coach' },
      { status: 500 }
    )
  }
}

