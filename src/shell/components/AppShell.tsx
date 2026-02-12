import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-3 z-50 bg-white dark:bg-stone-900 shadow-[4px_6px_0px_0px_rgba(28,25,23,0.9)] dark:shadow-[4px_6px_0px_0px_rgba(0,0,0,0.9)]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-xl font-heading font-black tracking-tighter uppercase px-2 py-1 bg-lime-400 text-stone-900 border-2 border-stone-900 cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all">
              Vietnam Rising
            </div>
            <MainNav items={navigationItems} onNavigate={onNavigate} />
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 border-2 border-stone-900 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-lime-400 transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-stone-50 dark:bg-stone-900 border-r-2 border-stone-900">
                <div className="flex flex-col gap-2 mt-8">
                  <div className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500 mb-2 px-2">
                    Navigate
                  </div>
                  {navigationItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => {
                        onNavigate?.(item.href)
                        setMobileMenuOpen(false)
                      }}
                      className={`
                        px-4 py-3 font-heading font-black text-sm uppercase tracking-tight transition-all border-2 text-left
                        ${item.isActive
                          ? 'bg-lime-400 text-stone-900 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]'
                          : 'bg-transparent text-stone-600 dark:text-stone-400 border-transparent hover:border-stone-900 hover:text-stone-900 dark:hover:text-stone-100'
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <UserMenu user={user} onHireMe={onHireMe} />
          </div>
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
