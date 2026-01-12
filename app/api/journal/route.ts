import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'
import { eq, and, gte, lte, desc } from 'drizzle-orm'

const journalEntrySchema = z.object({
  date: z.string().optional(),
  moodScore: z.number().min(1).max(10),
  emotion: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const userId = parseInt(session.user.id)

    let conditions: any[] = [eq(schema.journalEntriesTable.userId, userId)]

    if (startDate && endDate) {
      conditions.push(
        gte(schema.journalEntriesTable.date, new Date(startDate)),
        lte(schema.journalEntriesTable.date, new Date(endDate))
      )
    }

    const entries = await db
      .select()
      .from(schema.journalEntriesTable)
      .where(and(...conditions))
      .orderBy(desc(schema.journalEntriesTable.date))

    return NextResponse.json(entries)
  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des entrées' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const data = journalEntrySchema.parse(body)
    const userId = parseInt(session.user.id)

    const entryDate = data.date ? new Date(data.date) : new Date()
    entryDate.setHours(0, 0, 0, 0)

    const existing = await db
      .select()
      .from(schema.journalEntriesTable)
      .where(
        and(
          eq(schema.journalEntriesTable.userId, userId),
          eq(schema.journalEntriesTable.date, entryDate)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      const [updated] = await db
        .update(schema.journalEntriesTable)
        .set({
          moodScore: data.moodScore,
          emotion: data.emotion || null,
          notes: data.notes || null,
          updatedAt: new Date(),
        })
        .where(eq(schema.journalEntriesTable.id, existing[0].id))
        .returning()

      return NextResponse.json(updated)
    }

    const [newEntry] = await db
      .insert(schema.journalEntriesTable)
      .values({
        userId,
        date: entryDate,
        moodScore: data.moodScore,
        emotion: data.emotion || null,
        notes: data.notes || null,
      })
      .returning()

    return NextResponse.json(newEntry)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'entrée' },
      { status: 500 }
    )
  }
}
