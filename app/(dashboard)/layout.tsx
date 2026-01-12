import { Nav } from '@/components/navigation/nav'
import { getSession } from '@/lib/get-session'
// import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Désactivé pour faciliter le développement
  // Pour réactiver la protection des routes, décommentez les lignes suivantes :
  // if (!session) {
  //   redirect('/login')
  // }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

