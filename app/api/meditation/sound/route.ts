import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'

const soundSessionSchema = z.object({
  soundType: z.string(),
  duration: z.number().min(0),
  volume: z.number().min(0).max(100).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const data = soundSessionSchema.parse(body)
    const userId = parseInt(session.user.id)

    const [sessionEntry] = await db
      .insert(schema.soundSessionsTable)
      .values({
        userId,
        soundType: data.soundType,
        duration: data.duration,
        volume: data.volume || 50,
      })
      .returning()

    return NextResponse.json(sessionEntry)
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

