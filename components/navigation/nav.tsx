'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/journal', label: 'Journal', icon: '📝' },
  { href: '/productivite', label: 'Productivité', icon: '✅' },
  { href: '/meditation', label: 'Méditation', icon: '🧘' },
  { href: '/rapports', label: 'Rapports', icon: '📈' },
]

export function Nav() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.href = '/login'
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              Santé Mentale
            </Link>
            <div className="hidden md:flex md:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Déconnexion
          </Button>
        </div>
      </div>
      {/* Mobile navigation */}
      <div className="border-t border-gray-200 md:hidden">
        <div className="flex space-x-1 overflow-x-auto px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                pathname === item.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

