import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { z } from 'zod'
import { eq, and, gte, lte, desc } from 'drizzle-orm'

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
    const userId = parseInt(session.user.id)

    let conditions: any[] = [eq(schema.productivityEntriesTable.userId, userId)]

    if (startDate && endDate) {
      conditions.push(
        gte(schema.productivityEntriesTable.date, new Date(startDate)),
        lte(schema.productivityEntriesTable.date, new Date(endDate))
      )
    }

    if (completed !== null) {
      conditions.push(eq(schema.productivityEntriesTable.completed, completed === 'true'))
    }

    const entries = await db
      .select()
      .from(schema.productivityEntriesTable)
      .where(and(...conditions))
      .orderBy(desc(schema.productivityEntriesTable.date))

    return NextResponse.json(entries)
  } catch (err) {
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
    const userId = parseInt(session.user.id)

    const entryDate = data.date ? new Date(data.date) : new Date()
    entryDate.setHours(0, 0, 0, 0)

    const [newEntry] = await db
      .insert(schema.productivityEntriesTable)
      .values({
        userId,
        date: entryDate,
        task: data.task,
        description: data.description || null,
        timeSpent: data.timeSpent || null,
        completed: data.completed ?? false,
        priority: data.priority || null,
      })
      .returning()

    return NextResponse.json(newEntry)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
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
    const { id, ...updateData } = body
    const userId = parseInt(session.user.id)

    const [updated] = await db
      .update(schema.productivityEntriesTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.productivityEntriesTable.id, id),
          eq(schema.productivityEntriesTable.userId, userId)
        )
      )
      .returning()

    return NextResponse.json(updated)
  } catch (err) {
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
    const id = parseInt(searchParams.get('id') || '0')
    const userId = parseInt(session.user.id)

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    await db
      .delete(schema.productivityEntriesTable)
      .where(
        and(
          eq(schema.productivityEntriesTable.id, id),
          eq(schema.productivityEntriesTable.userId, userId)
        )
      )

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la tâche' },
      { status: 500 }
    )
  }
}
