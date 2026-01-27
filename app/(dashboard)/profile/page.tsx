import { getSession } from "@/lib/get-session";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user?.id) {
    return <div>Session invalide</div>;
  }

  const userId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(userId)) {
    return <div>Session invalide</div>;
  }

  // Récupérer les informations de l'utilisateur connecté
  let user;
  try {
    user = await db
      .select({
        id: schema.usersTable.id,
        name: schema.usersTable.name,
        age: schema.usersTable.age,
        email: schema.usersTable.email,
        role: schema.usersTable.role,
      })
      .from(schema.usersTable)
      .where(eq(schema.usersTable.id, userId))
      .limit(1);
  } catch (error) {
    return <div>Impossible de charger votre profil pour le moment.</div>;
  }

  if (user.length === 0) {
    return <div>Utilisateur non trouvé</div>;
  }

  const currentUser = user[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mon profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <p className="mt-1 text-sm text-gray-900">{currentUser.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-sm text-gray-900">{currentUser.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Âge
            </label>
            <p className="mt-1 text-sm text-gray-900">{currentUser.age}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rôle
            </label>
            <span
              className={`mt-1 inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                currentUser.role === "admin"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {currentUser.role}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Modifier mon profil
          </button>
        </div>
      </div>
    </div>
  );
}
