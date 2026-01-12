import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { calculateCorrelations } from "@/lib/analytics";

export default async function CorrelationsPage() {
  const session = await getSession();
  if (!session) return null;

  const userId = parseInt(session.user.id);
  const correlations = await calculateCorrelations(userId, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Corrélations
        </h1>
        <p className="text-[#a0a0a0] mt-2">Relations entre humeur, sommeil et activité</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Corrélation humeur ↔ sommeil</CardTitle>
          <CardDescription>4 dernières semaines</CardDescription>
        </CardHeader>
        <CardContent>
          {correlations.sleep !== null ? (
            <div>
              <div className="text-4xl font-bold text-[#f5f5f5] mb-4">
                {correlations.sleep > 0 ? '+' : ''}
                {correlations.sleep.toFixed(2)}
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    correlations.sleep > 0.3
                      ? 'bg-green-500'
                      : correlations.sleep > 0
                      ? 'bg-blue-500'
                      : correlations.sleep > -0.3
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.abs(correlations.sleep) * 100}%`,
                    marginLeft: correlations.sleep < 0 ? 'auto' : '0',
                  }}
                />
              </div>
              <p className="text-sm text-[#a0a0a0] mt-4">
                {correlations.sleep > 0.3
                  ? 'Corrélation positive forte : Plus tu dors, mieux tu te sens'
                  : correlations.sleep > 0
                  ? 'Corrélation positive modérée'
                  : correlations.sleep > -0.3
                  ? 'Corrélation négative modérée'
                  : 'Corrélation négative forte'}
              </p>
            </div>
          ) : (
            <p className="text-[#a0a0a0]">
              Pas assez de données pour calculer la corrélation. Enregistre ton sommeil et ton humeur pour voir les corrélations.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Corrélation humeur ↔ activité</CardTitle>
          <CardDescription>4 dernières semaines</CardDescription>
        </CardHeader>
        <CardContent>
          {correlations.activity !== null ? (
            <div>
              <div className="text-4xl font-bold text-[#f5f5f5] mb-4">
                {correlations.activity > 0 ? '+' : ''}
                {correlations.activity.toFixed(2)}
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    correlations.activity > 0.3
                      ? 'bg-green-500'
                      : correlations.activity > 0
                      ? 'bg-blue-500'
                      : correlations.activity > -0.3
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.abs(correlations.activity) * 100}%`,
                    marginLeft: correlations.activity < 0 ? 'auto' : '0',
                  }}
                />
              </div>
              <p className="text-sm text-[#a0a0a0] mt-4">
                {correlations.activity > 0.3
                  ? 'Corrélation positive forte : Plus tu es actif, mieux tu te sens'
                  : correlations.activity > 0
                  ? 'Corrélation positive modérée'
                  : correlations.activity > -0.3
                  ? 'Corrélation négative modérée'
                  : 'Corrélation négative forte'}
              </p>
            </div>
          ) : (
            <p className="text-[#a0a0a0]">
              Pas assez de données pour calculer la corrélation. Enregistre ton activité et ton humeur pour voir les corrélations.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

