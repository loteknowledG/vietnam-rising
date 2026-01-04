
interface MainNavProps {
    items: Array<{ label: string; href: string; isActive?: boolean }>
    onNavigate?: (href: string) => void
}

export function MainNav({ items, onNavigate }: MainNavProps) {
    return (
        <nav className="hidden md:flex items-center gap-1">
            {items.map((item) => (
                <button
                    key={item.href}
                    onClick={() => {
                        console.log('MainNav: Clicking', item.href)
                        onNavigate?.(item.href)
                    }}
                    className={`
            px-4 py-2 font-heading font-black text-xs uppercase tracking-widest transition-all border-2
            ${item.isActive
                            ? 'bg-lime-400 text-stone-900 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]'
                            : 'bg-transparent text-stone-600 border-transparent hover:border-stone-900 hover:text-stone-900'
                        }
          `}
                >
                    {item.label}
                </button>
            ))}
        </nav>
    )
}
