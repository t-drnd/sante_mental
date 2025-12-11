import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { startOfDay, endOfDay } from "date-fns";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Récupérer toutes les données en parallèle pour optimiser les performances
  const [todayJournal, todayTasks, todayMeditation, recentEntries] =
    await Promise.all([
      db.journalEntry.findUnique({
        where: {
          userId_date: {
            userId: session.user.id,
            date: todayStart,
          },
        },
      }),
      db.productivityEntry.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      db.meditationSession.findFirst({
        where: {
          userId: session.user.id,
          date: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      db.journalEntry.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: weekAgo,
          },
        },
        orderBy: { date: "asc" },
      }),
    ]);

  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const totalTasks = todayTasks.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de votre bien-être</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Humeur du jour</CardTitle>
          </CardHeader>
          <CardContent>
            {todayJournal ? (
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {todayJournal.moodScore}/10
                </div>
                {todayJournal.emotion && (
                  <p className="text-sm text-gray-600 mt-1">
                    {todayJournal.emotion}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-2">Aucune entrée aujourd'hui</p>
                <Link href="/journal">
                  <Button size="sm">Ajouter</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Productivité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {completedTasks}/{totalTasks}
            </div>
            <p className="text-sm text-gray-600 mt-1">tâches complétées</p>
            <Link
              href="/productivite"
              className="text-sm text-blue-600 hover:underline mt-2 inline-block"
            >
              Voir toutes les tâches
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Méditation</CardTitle>
          </CardHeader>
          <CardContent>
            {todayMeditation ? (
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {todayMeditation.duration}min
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {todayMeditation.type}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-2">Aucune session aujourd'hui</p>
                <Link href="/meditation">
                  <Button size="sm">Commencer</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rapports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">
              Consultez vos rapports hebdomadaires
            </p>
            <Link href="/rapports">
              <Button size="sm">Voir les rapports</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution de l'humeur (7 derniers jours)</CardTitle>
          <CardDescription>
            Votre score d'humeur au fil du temps
          </CardDescription>
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
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{ height: `${(entry.moodScore / 10) * 100}%` }}
                    title={`${formatDate(entry.date)}: ${entry.moodScore}/10`}
                  />
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(entry.date).getDate()}/
                    {new Date(entry.date).getMonth() + 1}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune donnée disponible. Commencez à enregistrer votre humeur !
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/journal">
              <Button className="w-full" variant="outline">
                📝 Consigner mon humeur
              </Button>
            </Link>
            <Link href="/productivite">
              <Button className="w-full" variant="outline">
                ✅ Ajouter une tâche
              </Button>
            </Link>
            <Link href="/meditation">
              <Button className="w-full" variant="outline">
                🧘 Commencer une méditation
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernière entrée journal</CardTitle>
          </CardHeader>
          <CardContent>
            {todayJournal ? (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {todayJournal.notes || "Aucune note"}
                </p>
                <Link href="/journal">
                  <Button size="sm" variant="outline">
                    Voir le journal
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">Aucune entrée aujourd'hui</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
