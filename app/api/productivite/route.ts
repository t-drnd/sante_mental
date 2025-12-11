import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'

const productivityEntrySchema = z.object({
  date: z.string().optional(),
  task: z.string().min(1),
  description: z.string().optional(),
  timeSpent: z.number().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
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
    const completed = searchParams.get('completed')

    const where: any = { userId: session.user.id }
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }
    if (completed !== null) {
      where.completed = completed === 'true'
    }

    const entries = await db.productivityEntry.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(entries)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tâches' },
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
    const data = productivityEntrySchema.parse(body)

    const date = data.date ? new Date(data.date) : new Date()
    date.setHours(0, 0, 0, 0)

    const entry = await db.productivityEntry.create({
      data: {
        userId: session.user.id,
        date,
        task: data.task,
        description: data.description,
        timeSpent: data.timeSpent,
        completed: data.completed ?? false,
        priority: data.priority ?? 'medium',
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création de la tâche' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...data } = body

    const entry = await db.productivityEntry.update({
      where: {
        id,
        userId: session.user.id,
      },
      data,
    })

    return NextResponse.json(entry)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la tâche' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    await db.productivityEntry.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la tâche' },
      { status: 500 }
    )
  }
}

