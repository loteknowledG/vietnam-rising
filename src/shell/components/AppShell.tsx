import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

interface AppShellProps {
  children: React.ReactNode
  navigationItems: Array<{ label: string; href: string; isActive?: boolean }>
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onHireMe?: () => void
}

export function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onHireMe
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-stone-900 border-b-2 border-stone-900 dark:border-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-xl font-heading font-black tracking-tighter uppercase px-2 py-1 bg-lime-400 text-stone-900 border-2 border-stone-900 cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all">
              Vietnam Rising
            </div>
            <MainNav items={navigationItems} onNavigate={onNavigate} />
          </div>
          <UserMenu user={user} onHireMe={onHireMe} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-0">
        {children}
      </main>

      {/* Footer (Optional Design Touch) */}
      <footer className="border-t-2 border-stone-900 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-mono uppercase tracking-widest text-stone-500">
          <span>© 2026 VIETNAM RISING</span>
          <span>BUILT FOR DESIGN SHOWCASE</span>
        </div>
      </footer>
    </div>
  )
}
