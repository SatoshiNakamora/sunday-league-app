'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Calendar, BarChart3, Trophy } from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/players', label: 'Players', icon: Users },
  { href: '/matches', label: 'Matches', icon: Calendar },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="relative bg-black/40 backdrop-blur-xl border-b-2 border-cyan-500/30 sticky top-0 z-50 overflow-hidden">
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Trophy className="h-10 w-10 text-cyan-400 group-hover:text-cyan-300 transition-all duration-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]" />
                <div className="absolute inset-0 bg-cyan-400/30 blur-xl rounded-full group-hover:bg-cyan-300/50 transition-all duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-3xl tracking-tight text-white uppercase leading-none">
                  SUNDAY
                </span>
                <span className="font-display text-2xl tracking-tight text-cyan-400 uppercase leading-none">
                  LEAGUE
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'nav-link',
                      isActive && 'nav-link-active'
                    )}
                  >
                    <Icon className={clsx('h-5 w-5', isActive ? 'text-cyan-400' : 'text-gray-500')} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t-2 border-cyan-500/20 bg-black/60 backdrop-blur-md">
        <div className="px-2 py-3 flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex flex-col items-center px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300',
                  isActive
                    ? 'text-cyan-400'
                    : 'text-gray-500 hover:text-cyan-300'
                )}
              >
                <Icon
                  className={clsx(
                    'h-6 w-6 mb-1 transition-all duration-300',
                    isActive && 'text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]'
                  )}
                />
                <span className={isActive ? 'drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]' : ''}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}