import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'

const breathingSessionSchema = z.object({
  pattern: z.enum(['4-7-8', '5-5-5', '4-4-4']),
  cycles: z.number().min(0),
  duration: z.number().min(0),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const data = breathingSessionSchema.parse(body)
    const userId = parseInt(session.user.id)

    const [sessionEntry] = await db
      .insert(schema.breathingSessionsTable)
      .values({
        userId,
        pattern: data.pattern,
        cycles: data.cycles,
        duration: data.duration,
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

