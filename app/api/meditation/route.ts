import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'

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

    const where: any = { userId: session.user.id }
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const sessions = await db.meditationSession.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(sessions)
  } catch (error) {
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

    const date = data.date ? new Date(data.date) : new Date()

    const sessionEntry = await db.meditationSession.create({
      data: {
        userId: session.user.id,
        date,
        duration: data.duration,
        type: data.type,
        notes: data.notes,
        completed: data.completed ?? true,
      },
    })

    return NextResponse.json(sessionEntry)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    )
  }
}

