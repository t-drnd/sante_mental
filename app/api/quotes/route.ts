import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { db, schema } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'

const quotesByMood: Record<string, string[]> = {
  low: [
    "Les nuages passent, mais le ciel reste toujours là.",
    "Chaque jour est une nouvelle chance de recommencer.",
    "Tu es plus fort que tu ne le penses.",
    "Les difficultés d'aujourd'hui sont la force de demain.",
  ],
  medium: [
    "Prends le temps de respirer et d'apprécier le moment présent.",
    "Chaque petit pas compte dans ton parcours.",
    "Tu fais de ton mieux, et c'est suffisant.",
    "L'équilibre vient de l'acceptation de soi.",
  ],
  high: [
    "Continue sur cette belle lancée !",
    "Tu rayonnes de positivité aujourd'hui.",
    "Profite de ce moment de bien-être.",
    "Ta joie est contagieuse et inspirante.",
  ],
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)

    const todayEntry = await db
      .select()
      .from(schema.journalEntriesTable)
      .where(eq(schema.journalEntriesTable.userId, userId))
      .orderBy(desc(schema.journalEntriesTable.date))
      .limit(1)
      .then((results) => results[0] || null)

    const moodCategory =
      todayEntry && todayEntry.moodScore < 4
        ? 'low'
        : todayEntry && todayEntry.moodScore > 7
        ? 'high'
        : 'medium'

    const quotes = quotesByMood[moodCategory]
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

    return NextResponse.json({
      quote: randomQuote,
      category: moodCategory,
      allQuotes: quotesByMood,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

