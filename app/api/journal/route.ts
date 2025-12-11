import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'

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

    const where: any = { userId: session.user.id }
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const entries = await db.journalEntry.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(entries)
  } catch (error) {
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

    const date = data.date ? new Date(data.date) : new Date()
    date.setHours(0, 0, 0, 0)

    const entry = await db.journalEntry.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date,
        },
      },
      update: {
        moodScore: data.moodScore,
        emotion: data.emotion,
        notes: data.notes,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        date,
        moodScore: data.moodScore,
        emotion: data.emotion,
        notes: data.notes,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'entrée' },
      { status: 500 }
    )
  }
}

