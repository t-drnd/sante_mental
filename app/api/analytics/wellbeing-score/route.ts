import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { calculateWellbeingScore } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')

    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const end = new Date()

    const score = await calculateWellbeingScore(userId, { start, end })

    return NextResponse.json(score)
  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur lors du calcul' },
      { status: 500 }
    )
  }
}

