import { User, Rocket } from 'lucide-react'

interface UserMenuProps {
    user?: { name: string; avatarUrl?: string }
    onHireMe?: () => void
}

export function UserMenu({ user, onHireMe }: UserMenuProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border-2 border-stone-900 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
                <div className="w-6 h-6 rounded-full bg-fuchsia-400 border border-stone-900 flex items-center justify-center overflow-hidden">
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-4 h-4 text-stone-900" />
                    )}
                </div>
                <span className="text-xs font-heading font-black uppercase tracking-tight">
                    {user?.name || 'Portfolio Visitor'}
                </span>
            </div>

            <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => onHireMe?.()}
                className="inline-flex items-center gap-2 bg-fuchsia-400 text-stone-900 px-4 py-2 border-2 border-stone-900 font-heading font-black text-sm uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
                <Rocket className="w-4 h-4" />
                Hire Me
            </a>
        </div>
    )
}
