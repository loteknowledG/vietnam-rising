import { Info, Map as MapIcon, TrendingUp } from 'lucide-react'

interface CityHUDHanoiProps {
    cityName: string
    jobCount: number
    activeSkyscraper: string
}

export function CityHUDHanoi({ cityName, jobCount, activeSkyscraper }: CityHUDHanoiProps) {
    return (
        <div className="fixed bottom-8 left-8 z-40 flex flex-col gap-4 pointer-events-none">
            {/* City Badge (Amber for Hanoi) */}
            <div className="bg-amber-400 border-2 border-stone-900 p-4 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] pointer-events-auto">
                <div className="flex items-center gap-2 mb-1">
                    <MapIcon className="w-4 h-4 text-stone-900" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-tighter text-stone-700">CAPITAL HUB</span>
                </div>
                <h2 className="text-2xl font-heading font-black uppercase tracking-tighter text-stone-900 leading-none">
                    {cityName}
                </h2>
            </div>

            {/* Stats HUD */}
            <div className="bg-stone-900 border-2 border-stone-900 p-4 shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] text-white pointer-events-auto">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="w-3 h-3 text-amber-400" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400">ACTIVE FEED</span>
                        </div>
                        <div className="text-xl font-heading font-black leading-none">{jobCount} LISTINGS</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <Info className="w-3 h-3 text-amber-400" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400">STRUCTURE</span>
                        </div>
                        <div className="text-[10px] font-heading font-black uppercase tracking-tight leading-none">{activeSkyscraper}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
