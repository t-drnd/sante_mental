import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'
import { eq, desc, and, gte, lte } from 'drizzle-orm'

const habitSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)

    const habits = await db
      .select()
      .from(schema.microHabitsTable)
      .where(eq(schema.microHabitsTable.userId, userId))
      .orderBy(desc(schema.microHabitsTable.createdAt))

    return NextResponse.json(habits)
  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
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
    const data = habitSchema.parse(body)
    const userId = parseInt(session.user.id)

    const [habit] = await db
      .insert(schema.microHabitsTable)
      .values({
        userId,
        title: data.title,
        description: data.description || null,
      })
      .returning()

    return NextResponse.json(habit)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}

