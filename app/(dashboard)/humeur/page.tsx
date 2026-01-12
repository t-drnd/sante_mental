import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { eq, gte, desc } from "drizzle-orm";
import { subDays, format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function HumeurPage() {
  const session = await getSession();
  if (!session) return null;

  const userId = parseInt(session.user.id);
  const thirtyDaysAgo = subDays(new Date(), 30);

  const entries = await db
    .select()
    .from(schema.journalEntriesTable)
    .where(
      eq(schema.journalEntriesTable.userId, userId)
    )
    .orderBy(desc(schema.journalEntriesTable.date))
    .limit(100);

  const filteredEntries = entries.filter(
    (e) => new Date(e.date) >= thirtyDaysAgo
  );

  const averageMood =
    filteredEntries.length > 0
      ? filteredEntries.reduce((sum, e) => sum + e.moodScore, 0) /
        filteredEntries.length
      : null;

  const dayOfWeekData: Record<string, number[]> = {};
  filteredEntries.forEach((entry) => {
    const dayName = format(new Date(entry.date), "EEEE", { locale: fr });
    if (!dayOfWeekData[dayName]) dayOfWeekData[dayName] = [];
    dayOfWeekData[dayName].push(entry.moodScore);
  });

  const dayAverages: Record<string, number> = {};
  Object.keys(dayOfWeekData).forEach((day) => {
    const moods = dayOfWeekData[day];
    dayAverages[day] = moods.reduce((sum, m) => sum + m, 0) / moods.length;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Tracker d'humeur
        </h1>
        <p className="text-[#a0a0a0] mt-2">Évolution de ton humeur sur 30 jours</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Humeur moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            {averageMood !== null ? (
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {averageMood.toFixed(1)}/10
              </div>
            ) : (
              <p className="text-[#a0a0a0]">Pas assez de données</p>
            )}
            <p className="text-sm text-[#a0a0a0] mt-2">30 derniers jours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total d'entrées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#f5f5f5]">
              {filteredEntries.length}
            </div>
            <p className="text-sm text-[#a0a0a0] mt-2">Enregistrements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendance</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEntries.length >= 2 ? (
              <div>
                {filteredEntries[0].moodScore > filteredEntries[filteredEntries.length - 1].moodScore ? (
                  <div className="text-2xl">📈 <span className="text-green-400">En amélioration</span></div>
                ) : filteredEntries[0].moodScore < filteredEntries[filteredEntries.length - 1].moodScore ? (
                  <div className="text-2xl">📉 <span className="text-red-400">En baisse</span></div>
                ) : (
                  <div className="text-2xl">➡️ <span className="text-[#a0a0a0]">Stable</span></div>
                )}
              </div>
            ) : (
              <p className="text-[#a0a0a0]">Pas assez de données</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution sur 30 jours</CardTitle>
          <CardDescription>Graphique de ton humeur</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEntries.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-1">
              {filteredEntries.slice(0, 30).reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t transition-all hover:from-purple-500 hover:to-pink-500"
                    style={{ height: `${(entry.moodScore / 10) * 100}%` }}
                    title={`${format(new Date(entry.date), "dd/MM")}: ${entry.moodScore}/10`}
                  />
                  <span className="text-xs text-[#a0a0a0] mt-1">
                    {format(new Date(entry.date), "dd/MM")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#a0a0a0] text-center py-8">
              Aucune donnée disponible
            </p>
          )}
        </CardContent>
      </Card>

      {Object.keys(dayAverages).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Humeur par jour de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(dayAverages)
                .sort((a, b) => b[1] - a[1])
                .map(([day, avg]) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-[#f5f5f5] capitalize">{day}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-[#1a1a1a] rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${(avg / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-[#a0a0a0] w-12 text-right">
                        {avg.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

