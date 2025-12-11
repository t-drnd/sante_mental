import { WeeklyReport } from '@/components/rapports/weekly-report'

export default function RapportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rapports hebdomadaires</h1>
        <p className="text-gray-600">
          Analysez votre bien-être et votre productivité sur une base hebdomadaire
        </p>
      </div>

      <WeeklyReport />
    </div>
  )
}

