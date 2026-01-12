import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { schema } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { startOfDay, endOfDay } from "date-fns";
import { eq, and, gte, lte } from "drizzle-orm";
import { calculateWellbeingScore } from "@/lib/analytics";

export default async function BienEtrePage() {
  const session = await getSession();
  if (!session) return null;

  const userId = parseInt(session.user.id);
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [todayJournal, todayTasks, todayMeditation, recentEntries] =
    await Promise.all([
      db
        .select()
        .from(schema.journalEntriesTable)
        .where(
          and(
            eq(schema.journalEntriesTable.userId, userId),
            gte(schema.journalEntriesTable.date, todayStart),
            lte(schema.journalEntriesTable.date, todayEnd)
          )
        )
        .limit(1)
        .then((results) => results[0] || null),
      db
        .select()
        .from(schema.productivityEntriesTable)
        .where(
          and(
            eq(schema.productivityEntriesTable.userId, userId),
            gte(schema.productivityEntriesTable.date, todayStart),
            lte(schema.productivityEntriesTable.date, todayEnd)
          )
        ),
      db
        .select()
        .from(schema.meditationSessionsTable)
        .where(
          and(
            eq(schema.meditationSessionsTable.userId, userId),
            gte(schema.meditationSessionsTable.date, todayStart),
            lte(schema.meditationSessionsTable.date, todayEnd)
          )
        )
        .limit(1)
        .then((results) => results[0] || null),
      db
        .select()
        .from(schema.journalEntriesTable)
        .where(
          and(
            eq(schema.journalEntriesTable.userId, userId),
            gte(schema.journalEntriesTable.date, weekAgo)
          )
        ),
    ]);

  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const totalTasks = todayTasks.length;
  const averageMood = recentEntries.length > 0
    ? recentEntries.reduce((sum, e) => sum + e.moodScore, 0) / recentEntries.length
    : null;

  const wellbeingScore = await calculateWellbeingScore(userId, {
    start: weekAgo,
    end: today,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Suivi du bien-être
        </h1>
        <p className="text-[#a0a0a0] mt-2">Vue d'ensemble de votre bien-être</p>
      </div>

      <Card className="border-purple-500/30 hover:border-purple-500/50 transition-all">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-400">Score de bien-être</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            {wellbeingScore.score}/100
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <div className="text-sm text-[#a0a0a0]">Humeur</div>
              <div className="text-xl font-semibold text-[#f5f5f5]">{wellbeingScore.breakdown.mood}</div>
            </div>
            <div>
              <div className="text-sm text-[#a0a0a0]">Méditation</div>
              <div className="text-xl font-semibold text-[#f5f5f5]">{wellbeingScore.breakdown.meditation}</div>
            </div>
            <div>
              <div className="text-sm text-[#a0a0a0]">Productivité</div>
              <div className="text-xl font-semibold text-[#f5f5f5]">{wellbeingScore.breakdown.productivity}</div>
            </div>
            <div>
              <div className="text-sm text-[#a0a0a0]">Sommeil</div>
              <div className="text-xl font-semibold text-[#f5f5f5]">{wellbeingScore.breakdown.sleep}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-blue-500/30 hover:border-blue-500/50 transition-all">
          <CardHeader>
            <CardTitle className="text-lg text-blue-400">Humeur moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            {averageMood !== null ? (
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {averageMood.toFixed(1)}/10
              </div>
            ) : (
              <p className="text-[#a0a0a0]">Aucune donnée</p>
            )}
            <p className="text-sm text-[#a0a0a0] mt-2">7 derniers jours</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 hover:border-green-500/50 transition-all">
          <CardHeader>
            <CardTitle className="text-lg text-green-400">Productivité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {completedTasks}/{totalTasks}
            </div>
            <p className="text-sm text-[#a0a0a0] mt-2">tâches complétées aujourd'hui</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 hover:border-purple-500/50 transition-all">
          <CardHeader>
            <CardTitle className="text-lg text-purple-400">Méditation</CardTitle>
          </CardHeader>
          <CardContent>
            {todayMeditation ? (
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {todayMeditation.duration}min
                </div>
                <p className="text-sm text-[#a0a0a0] mt-2">Session aujourd'hui</p>
              </div>
            ) : (
              <p className="text-[#a0a0a0]">Aucune session aujourd'hui</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution de l'humeur</CardTitle>
          <CardDescription>7 derniers jours</CardDescription>
        </CardHeader>
        <CardContent>
          {recentEntries.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-2">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t transition-all hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20"
                    style={{ height: `${(entry.moodScore / 10) * 100}%` }}
                    title={`${entry.moodScore}/10`}
                  />
                  <span className="text-xs text-[#a0a0a0] mt-1">
                    {new Date(entry.date).getDate()}/
                    {new Date(entry.date).getMonth() + 1}
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
    </div>
  );
}

