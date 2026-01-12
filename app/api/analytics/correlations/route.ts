import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { calculateCorrelations } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)
    const { searchParams } = new URL(request.url)
    const weeks = parseInt(searchParams.get('weeks') || '4')

    const correlations = await calculateCorrelations(userId, weeks)

    return NextResponse.json(correlations)
  } catch (err) {
    return NextResponse.json(
      { error: 'Erreur lors du calcul' },
      { status: 500 }
    )
  }
}

