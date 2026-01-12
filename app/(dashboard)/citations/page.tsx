import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { eq, desc } from "drizzle-orm";

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
};

export default async function CitationsPage() {
  const session = await getSession();
  if (!session) return null;

  const userId = parseInt(session.user.id);

  const todayEntry = await db
    .select()
    .from(schema.journalEntriesTable)
    .where(
      eq(schema.journalEntriesTable.userId, userId)
    )
    .orderBy(desc(schema.journalEntriesTable.date))
    .limit(1)
    .then((results) => results[0] || null);

  const moodCategory =
    todayEntry && todayEntry.moodScore < 4
      ? "low"
      : todayEntry && todayEntry.moodScore > 7
      ? "high"
      : "medium";

  const quotes = quotesByMood[moodCategory];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Citations contextuelles
        </h1>
        <p className="text-[#a0a0a0] mt-2">Une citation adaptée à ton humeur du jour</p>
      </div>

      <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
        <CardContent className="py-16 text-center">
          <p className="text-3xl font-light text-[#f5f5f5] italic mb-4">
            "{randomQuote}"
          </p>
          <p className="text-sm text-[#a0a0a0]">
            Citation du jour • Adaptée à ton humeur actuelle
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bibliothèque de citations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">Quand tu te sens mal</h3>
              <div className="space-y-2">
                {quotesByMood.low.map((quote, idx) => (
                  <p key={idx} className="text-sm text-[#a0a0a0] italic">
                    "{quote}"
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">Quand tu te sens bien</h3>
              <div className="space-y-2">
                {quotesByMood.high.map((quote, idx) => (
                  <p key={idx} className="text-sm text-[#a0a0a0] italic">
                    "{quote}"
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">Pour l'équilibre</h3>
              <div className="space-y-2">
                {quotesByMood.medium.map((quote, idx) => (
                  <p key={idx} className="text-sm text-[#a0a0a0] italic">
                    "{quote}"
                  </p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

