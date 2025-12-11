import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const session = await getSession();

  if (session) {
    // Rediriger vers le dashboard si connecté
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-4xl space-y-8 text-center">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 md:text-6xl">
            Santé Mentale
          </h1>
          <p className="text-xl text-gray-600 md:text-2xl">
            Suivez votre bien-être au quotidien
          </p>
          <p className="mx-auto max-w-2xl text-gray-500">
            Une application complète pour gérer votre santé mentale avec un
            journal quotidien, des sessions de méditation et un suivi de votre
            productivité.
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>📔 Journal</CardTitle>
              <CardDescription>
                Enregistrez vos humeurs et vos pensées quotidiennes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Suivez votre évolution émotionnelle jour après jour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🧘 Méditation</CardTitle>
              <CardDescription>
                Pratiquez la méditation avec notre timer intégré
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Créez des sessions personnalisées pour votre bien-être
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>✅ Productivité</CardTitle>
              <CardDescription>
                Gérez vos tâches et suivez votre progression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Organisez votre journée et atteignez vos objectifs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-6 text-lg font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 w-full sm:w-auto"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-transparent px-6 text-lg font-medium transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 w-full sm:w-auto"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
