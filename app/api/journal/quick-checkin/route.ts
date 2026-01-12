import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'

const quickCheckinSchema = z.object({
  moodScore: z.number().min(1).max(10),
  emotion: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const data = quickCheckinSchema.parse(body)
    const userId = parseInt(session.user.id)

    const [checkin] = await db
      .insert(schema.quickCheckinsTable)
      .values({
        userId,
        moodScore: data.moodScore,
        emotion: data.emotion || null,
      })
      .returning()

    const [journalEntry] = await db
      .insert(schema.journalEntriesTable)
      .values({
        userId,
        moodScore: data.moodScore,
        emotion: data.emotion || null,
        entryType: 'quick',
      })
      .returning()

    return NextResponse.json({ checkin, journalEntry })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erreur lors du check-in' },
      { status: 500 }
    )
  }
}

