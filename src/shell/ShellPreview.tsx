import { AppShell } from './components/AppShell'

export default function ShellPreview() {
    const navigationItems = [
        { label: 'HCMC', href: '/hcmc', isActive: true },
        { label: 'Hanoi', href: '/hanoi' },
        { label: 'Da Nang', href: '/danang' },
    ]

    const user = {
        name: 'Alex Morgan',
        avatarUrl: undefined,
    }

    return (
        <AppShell
            navigationItems={navigationItems}
            user={user}
            onNavigate={(href) => console.log('Navigate to:', href)}
            onHireMe={() => window.open('resume.html', '_blank', 'noopener,noreferrer')}
        >
            <div className="flex-1 flex flex-col">
                {/* Mock Parallax Surface */}
                <div className="relative h-[400px] w-full bg-stone-900 flex items-center justify-center overflow-hidden border-b-2 border-stone-900">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale" />
                    <div className="relative z-10 text-center">
                        <h2 className="text-6xl font-heading font-black text-white uppercase tracking-tighter mb-2 drop-shadow-[4px_4px_0px_rgba(163,230,53,1)]">
                            HO CHI MINH CITY
                        </h2>
                        <div className="inline-block bg-lime-400 text-stone-900 px-4 py-1 font-mono font-bold text-sm border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
                            LANDMARK 81 // FLAGSHIP HUB
                        </div>
                    </div>
                </div>

                {/* Mock Content */}
                <div className="p-8 max-w-4xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-8 border-b-4 border-stone-900 pb-4">
                        <h3 className="text-3xl font-heading font-black uppercase tracking-tight">
                            Featured React Roles
                        </h3>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-stone-900 text-white text-xs font-bold uppercase">HCMC</span>
                            <span className="px-2 py-1 bg-fuchsia-400 text-stone-900 text-xs font-bold uppercase border-2 border-stone-900">42 POSITIONS</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 bg-white dark:bg-stone-900 border-2 border-stone-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex justify-between items-center group">
                                <div>
                                    <div className="text-fuchsia-600 dark:text-fuchsia-400 font-mono text-sm font-bold mb-1 uppercase tracking-widest">LinkedIn / Posted 2h ago</div>
                                    <h4 className="text-xl font-heading font-black uppercase tracking-tight mb-1">Senior React Engineer</h4>
                                    <p className="text-stone-500 font-bold">Inertia Tech Systems // District 1</p>
                                </div>
                                <button className="px-6 py-2 bg-stone-900 text-white font-heading font-bold uppercase tracking-widest group-hover:bg-lime-400 group-hover:text-stone-900 transition-colors">
                                    View Job
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppShell>
    )
}
