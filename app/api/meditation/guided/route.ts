import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'

const guidedMeditationSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  duration: z.number().min(1),
  audioUrl: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)

    const meditations = await db
      .select()
      .from(schema.guidedMeditationsTable)
      .where(eq(schema.guidedMeditationsTable.userId, userId))
      .orderBy(desc(schema.guidedMeditationsTable.createdAt))

    return NextResponse.json(meditations)
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
    const data = guidedMeditationSchema.parse(body)
    const userId = parseInt(session.user.id)

    const [meditation] = await db
      .insert(schema.guidedMeditationsTable)
      .values({
        userId,
        title: data.title,
        category: data.category,
        duration: data.duration,
        audioUrl: data.audioUrl || null,
        completed: true,
        completedAt: new Date(),
      })
      .returning()

    const [sessionEntry] = await db
      .insert(schema.meditationSessionsTable)
      .values({
        userId,
        duration: data.duration,
        type: data.category,
        isGuided: true,
        audioUrl: data.audioUrl || null,
        completed: true,
      })
      .returning()

    return NextResponse.json({ meditation, session: sessionEntry })
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

