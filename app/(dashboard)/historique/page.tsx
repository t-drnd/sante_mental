import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function HistoriquePage() {
  const session = await getSession();
  if (!session) return null;

  const userId = parseInt(session.user.id);

  const [journalEntries, guidedEntries, checkins] = await Promise.all([
    db
      .select()
      .from(schema.journalEntriesTable)
      .where(eq(schema.journalEntriesTable.userId, userId))
      .orderBy(desc(schema.journalEntriesTable.date))
      .limit(50),
    db
      .select()
      .from(schema.guidedJournalEntriesTable)
      .where(eq(schema.guidedJournalEntriesTable.userId, userId))
      .orderBy(desc(schema.guidedJournalEntriesTable.date))
      .limit(50),
    db
      .select()
      .from(schema.quickCheckinsTable)
      .where(eq(schema.quickCheckinsTable.userId, userId))
      .orderBy(desc(schema.quickCheckinsTable.date))
      .limit(50),
  ]);

  const allEntries = [
    ...journalEntries.map((e) => ({ ...e, type: 'journal' as const })),
    ...guidedEntries.map((e) => ({ ...e, type: 'guided' as const })),
    ...checkins.map((e) => ({ ...e, type: 'checkin' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Historique émotionnel
        </h1>
        <p className="text-[#a0a0a0] mt-2">Toutes tes entrées et tendances</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Résumé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-[#f5f5f5]">{journalEntries.length}</div>
              <div className="text-sm text-[#a0a0a0]">Entrées journal</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f5f5f5]">{guidedEntries.length}</div>
              <div className="text-sm text-[#a0a0a0]">Journaux guidés</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f5f5f5]">{checkins.length}</div>
              <div className="text-sm text-[#a0a0a0]">Check-ins rapides</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique complet</CardTitle>
          <CardDescription>Dernières entrées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allEntries.slice(0, 20).map((entry) => (
              <div
                key={`${entry.type}-${entry.id}`}
                className="border-b border-[#1f1f1f] pb-4 last:border-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm text-[#a0a0a0]">
                      {format(new Date(entry.date), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </div>
                    <div className="text-xs text-purple-400 mt-1">
                      {entry.type === 'journal' && '📝 Journal'}
                      {entry.type === 'guided' && '📋 Journal guidé'}
                      {entry.type === 'checkin' && '⚡ Check-in rapide'}
                    </div>
                  </div>
                  {'moodScore' in entry && (
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {entry.moodScore}/10
                    </div>
                  )}
                </div>
                {'emotion' in entry && entry.emotion && (
                  <p className="text-sm text-[#a0a0a0] mb-2">Émotion: {entry.emotion}</p>
                )}
                {'notes' in entry && entry.notes && (
                  <p className="text-sm text-[#e0e0e0]">{entry.notes}</p>
                )}
                {'answer' in entry && (
                  <p className="text-sm text-[#e0e0e0]">{entry.answer}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

