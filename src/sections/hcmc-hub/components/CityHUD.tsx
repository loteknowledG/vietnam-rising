import { Info, Map as MapIcon, Database } from 'lucide-react'

interface CityHUDProps {
    cityName: string
    jobCount: number
    activeSkyscraper: string
}

export function CityHUD({ cityName, jobCount, activeSkyscraper }: CityHUDProps) {
    return (
        <div className="fixed bottom-8 left-8 z-40 flex flex-col gap-4 pointer-events-none">
            {/* City Badge */}
            <div className="bg-lime-400 border-2 border-stone-900 p-4 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] pointer-events-auto">
                <div className="flex items-center gap-2 mb-1">
                    <MapIcon className="w-4 h-4 text-stone-900" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-tighter text-stone-700">ACTIVE REGION</span>
                </div>
                <h2 className="text-2xl font-heading font-black uppercase tracking-tighter text-stone-900 leading-none">
                    {cityName}
                </h2>
            </div>

            {/* Stats HUD */}
            <div className="bg-stone-900 border-2 border-stone-900 p-4 shadow-[4px_4px_0px_0px_rgba(163,230,53,1)] text-white pointer-events-auto">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <Database className="w-3 h-3 text-lime-400" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400">REACT ROLES</span>
                        </div>
                        <div className="text-xl font-heading font-black leading-none">{jobCount}</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <Info className="w-3 h-3 text-fuchsia-400" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-400">STRUCTURE</span>
                        </div>
                        <div className="text-[10px] font-heading font-black uppercase tracking-tight leading-none">{activeSkyscraper}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
