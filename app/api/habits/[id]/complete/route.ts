import { NextRequest, NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { getSession } from '@/lib/get-session'
import { eq, and, gte, lte } from 'drizzle-orm'
import { startOfDay, endOfDay } from 'date-fns'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const habitId = parseInt(id)
    const userId = parseInt(session.user.id)

    const habit = await db
      .select()
      .from(schema.microHabitsTable)
      .where(
        and(
          eq(schema.microHabitsTable.id, habitId),
          eq(schema.microHabitsTable.userId, userId)
        )
      )
      .limit(1)

    if (habit.length === 0) {
      return NextResponse.json({ error: 'Habitude non trouvée' }, { status: 404 })
    }

    const today = new Date()
    const todayStart = startOfDay(today)
    const todayEnd = endOfDay(today)

    const existingCompletion = await db
      .select()
      .from(schema.habitCompletionsTable)
      .where(
        and(
          eq(schema.habitCompletionsTable.habitId, habitId),
          gte(schema.habitCompletionsTable.date, todayStart),
          lte(schema.habitCompletionsTable.date, todayEnd)
        )
      )
      .limit(1)

    if (existingCompletion.length > 0) {
      return NextResponse.json({ message: 'Déjà complété aujourd\'hui' })
    }

    await db.insert(schema.habitCompletionsTable).values({
      habitId,
      completed: true,
    })

    const currentHabit = habit[0]
    if (!currentHabit) {
      return NextResponse.json({ error: 'Habitude non trouvée' }, { status: 404 })
    }
    
    const newStreak = (currentHabit.streak || 0) + 1
    const longestStreak = Math.max(newStreak, currentHabit.longestStreak || 0)

    const [updated] = await db
      .update(schema.microHabitsTable)
      .set({
        streak: newStreak,
        longestStreak,
      })
      .where(eq(schema.microHabitsTable.id, habitId))
      .returning()

    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur lors de la complétion' },
      { status: 500 }
    )
  }
}

