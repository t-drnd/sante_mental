import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'

const affirmationSchema = z.object({
  text: z.string().min(1),
  category: z.string().optional().nullable(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)

    const affirmations = await db
      .select()
      .from(schema.affirmationsTable)
      .where(eq(schema.affirmationsTable.userId, userId))
      .orderBy(desc(schema.affirmationsTable.createdAt))

    return NextResponse.json(affirmations)
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
    const data = affirmationSchema.parse(body)
    const userId = parseInt(session.user.id)

    const [affirmation] = await db
      .insert(schema.affirmationsTable)
      .values({
        userId,
        text: data.text,
        category: data.category || null,
      })
      .returning()

    return NextResponse.json(affirmation)
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

