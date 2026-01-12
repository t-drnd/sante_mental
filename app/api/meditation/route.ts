import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'
import { eq, and, gte, lte, desc } from 'drizzle-orm'

const meditationSessionSchema = z.object({
  date: z.string().optional(),
  duration: z.number().min(1),
  type: z.string().min(1),
  notes: z.string().optional(),
  completed: z.boolean().optional(),
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

    let conditions: any[] = [eq(schema.meditationSessionsTable.userId, userId)]

    if (startDate && endDate) {
      conditions.push(
        gte(schema.meditationSessionsTable.date, new Date(startDate)),
        lte(schema.meditationSessionsTable.date, new Date(endDate))
      )
    }

    const sessions = await db
      .select()
      .from(schema.meditationSessionsTable)
      .where(and(...conditions))
      .orderBy(desc(schema.meditationSessionsTable.date))

    return NextResponse.json(sessions)
  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des sessions' },
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
    const data = meditationSessionSchema.parse(body)
    const userId = parseInt(session.user.id)

    const sessionDate = data.date ? new Date(data.date) : new Date()

    const [newSession] = await db
      .insert(schema.meditationSessionsTable)
      .values({
        userId,
        date: sessionDate,
        duration: data.duration,
        type: data.type,
        notes: data.notes || null,
        completed: data.completed ?? true,
      })
      .returning()

    return NextResponse.json(newSession)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    )
  }
}
