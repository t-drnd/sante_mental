import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'

const guidedEntrySchema = z.object({
  questionType: z.string(),
  question: z.string(),
  answer: z.string(),
})

const guidedJournalSchema = z.object({
  entries: z.array(guidedEntrySchema),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const data = guidedJournalSchema.parse(body)
    const userId = parseInt(session.user.id)

    const entries = await Promise.all(
      data.entries.map((entry) =>
        db
          .insert(schema.guidedJournalEntriesTable)
          .values({
            userId,
            questionType: entry.questionType,
            question: entry.question,
            answer: entry.answer,
          })
          .returning()
      )
    )

    return NextResponse.json({ entries })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const entries = await db
      .select()
      .from(schema.guidedJournalEntriesTable)
      .where(eq(schema.guidedJournalEntriesTable.userId, userId))
      .orderBy(desc(schema.guidedJournalEntriesTable.date))
      .limit(limit)

    return NextResponse.json(entries)
  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

