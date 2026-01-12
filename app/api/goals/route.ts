import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'

const goalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: z.enum(['active', 'completed', 'paused']).optional(),
  progress: z.number().min(0).max(100).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)

    const goals = await db
      .select()
      .from(schema.wellbeingGoalsTable)
      .where(eq(schema.wellbeingGoalsTable.userId, userId))
      .orderBy(desc(schema.wellbeingGoalsTable.createdAt))

    return NextResponse.json(goals)
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
    const data = goalSchema.parse(body)
    const userId = parseInt(session.user.id)

    const [goal] = await db
      .insert(schema.wellbeingGoalsTable)
      .values({
        userId,
        title: data.title,
        description: data.description || null,
        category: data.category || null,
        status: data.status || 'active',
        progress: data.progress || 0,
      })
      .returning()

    return NextResponse.json(goal)
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

