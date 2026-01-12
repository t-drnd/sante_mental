'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/home', label: 'Accueil', icon: '🏠' },
  { href: '/journal', label: 'Journal', icon: '📝' },
  { href: '/checkin', label: 'Check-in', icon: '⚡' },
  { href: '/meditation', label: 'Méditation', icon: '🧘' },
  { href: '/bien-etre', label: 'Bien-être', icon: '📊' },
  { href: '/rapports', label: 'Rapports', icon: '📈' },
]

export function Nav() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (err) {
      window.location.href = '/login'
    }
  }

  return (
    <nav className="border-b border-[#1f1f1f] bg-[#111111] backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/home" className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Santé Mentale
            </Link>
            <div className="hidden md:flex md:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                      : 'text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="outline" className="border-[#2a2a2a] hover:border-[#3a3a3a]">
                👤 Profil
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut} className="border-[#2a2a2a] hover:border-[#3a3a3a]">
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t border-[#1f1f1f] md:hidden bg-[#111111]">
        <div className="flex space-x-1 overflow-x-auto px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                pathname === item.href
                  ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/30'
                  : 'text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]'
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

