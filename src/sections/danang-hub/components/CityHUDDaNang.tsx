import { Building2, Briefcase, Waves } from 'lucide-react'

interface CityHUDDaNangProps {
    cityName: string
    jobCount: number
    activeSkyscraper: string
}

export function CityHUDDaNang({ cityName, jobCount, activeSkyscraper }: CityHUDDaNangProps) {
    return (
        <div className="fixed bottom-8 left-8 z-40 bg-stone-900 border-2 border-cyan-400 shadow-[6px_6px_0px_0px_rgba(6,182,212,1)] p-4 font-mono text-xs uppercase tracking-widest">
            <div className="flex flex-col gap-2 text-cyan-400">
                <div className="flex items-center gap-2">
                    <Waves className="w-4 h-4" strokeWidth={2.5} />
                    <span className="font-black">{cityName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" strokeWidth={2.5} />
                    <span className="font-bold text-[10px]">STRUCTURE: {activeSkyscraper}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" strokeWidth={2.5} />
                    <span className="font-bold text-[10px]">POSITIONS: {jobCount}</span>
                </div>
            </div>
        </div>
    )
}
