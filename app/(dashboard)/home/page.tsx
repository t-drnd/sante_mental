import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Accueil
        </h1>
        <p className="text-[#a0a0a0] mt-2">Accédez à toutes les fonctionnalités</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/bien-etre" className="md:col-span-2 lg:col-span-2 lg:row-span-2">
          <Card className="h-full min-h-[300px] hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-5xl">📊</span>
                <CardTitle className="text-3xl">Suivi du bien-être</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-6 text-lg">
                Consultez vos statistiques et votre évolution globale
              </p>
              <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors text-lg font-medium">
                <span>Accéder →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/journal" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">📝</span>
                <CardTitle className="text-xl">Journal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Enregistrez vos humeurs et vos pensées quotidiennes
              </p>
              <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                <span className="text-sm">Ouvrir →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/journal-guide" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">📋</span>
                <CardTitle className="text-xl">Journal guidé</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Réponds aux questions du jour
              </p>
              <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                <span className="text-sm">Commencer →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/checkin" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">⚡</span>
                <CardTitle className="text-xl">Check-in rapide</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Enregistre ton humeur en 1 clic
              </p>
              <div className="flex items-center text-pink-400 group-hover:text-pink-300 transition-colors">
                <span className="text-sm">Vite →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/humeur" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">📈</span>
                <CardTitle className="text-xl">Tracker d'humeur</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Graphiques et tendances de ton humeur
              </p>
              <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="text-sm">Voir →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/historique" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">📚</span>
                <CardTitle className="text-xl">Historique</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Toutes tes entrées et tendances
              </p>
              <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                <span className="text-sm">Explorer →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/meditation" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">🧘</span>
                <CardTitle className="text-xl">Méditation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Timer de méditation libre
              </p>
              <div className="flex items-center text-pink-400 group-hover:text-pink-300 transition-colors">
                <span className="text-sm">Commencer →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/meditation-guidee" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">🎧</span>
                <CardTitle className="text-xl">Méditations guidées</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Méditations pour stress, anxiété, sommeil
              </p>
              <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="text-sm">Écouter →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/respiration" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">🌬️</span>
                <CardTitle className="text-xl">Respiration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Cohérence cardiaque guidée
              </p>
              <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                <span className="text-sm">Respirer →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/sons" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">🔊</span>
                <CardTitle className="text-xl">Sons relaxants</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Pluie, océan, forêt, bruit blanc
              </p>
              <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                <span className="text-sm">Écouter →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/objectifs" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">🎯</span>
                <CardTitle className="text-xl">Objectifs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Définis et suis tes objectifs bien-être
              </p>
              <div className="flex items-center text-green-400 group-hover:text-green-300 transition-colors">
                <span className="text-sm">Voir →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/habitudes" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">🔄</span>
                <CardTitle className="text-xl">Micro-habitudes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Une action simple par jour
              </p>
              <div className="flex items-center text-orange-400 group-hover:text-orange-300 transition-colors">
                <span className="text-sm">Suivre →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/affirmations" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">✨</span>
                <CardTitle className="text-xl">Affirmations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Affirmations positives personnalisées
              </p>
              <div className="flex items-center text-yellow-400 group-hover:text-yellow-300 transition-colors">
                <span className="text-sm">Voir →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/citations" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">💭</span>
                <CardTitle className="text-xl">Citations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Citations selon ton humeur
              </p>
              <div className="flex items-center text-yellow-400 group-hover:text-yellow-300 transition-colors">
                <span className="text-sm">Lire →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/correlations" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">🔗</span>
                <CardTitle className="text-xl">Corrélations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Relations humeur ↔ sommeil / activité
              </p>
              <div className="flex items-center text-green-400 group-hover:text-green-300 transition-colors">
                <span className="text-sm">Analyser →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/coach" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">🤖</span>
                <CardTitle className="text-xl">Coach IA</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Coach mental avec intelligence artificielle
              </p>
              <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="text-sm">Parler →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/chat" className="lg:col-span-1">
          <Card className="h-full min-h-[200px] hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">💬</span>
                <CardTitle className="text-xl">Parle-moi</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Raconte-moi ta journée
              </p>
              <div className="flex items-center text-pink-400 group-hover:text-pink-300 transition-colors">
                <span className="text-sm">Partager →</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/productivite" className="md:col-span-2 lg:col-span-2">
          <Card className="h-full min-h-[200px] hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">✅</span>
                <CardTitle className="text-xl">Productivité</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#a0a0a0] mb-4 text-sm">
                Gérez vos tâches et suivez votre progression
              </p>
              <div className="flex items-center text-green-400 group-hover:text-green-300 transition-colors">
                <span className="text-sm">Voir →</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

