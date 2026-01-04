import { useEffect, useRef } from 'react'
import type { Job } from '@/../product/sections/danang-hub/types'
import { ExternalLink, MapPin, DollarSign, Calendar } from 'lucide-react'

interface JobFloorDaNangProps {
    job: Job
    onViewSource: (url: string) => void
}

export function JobFloorDaNang({ job, onViewSource }: JobFloorDaNangProps) {
    const floorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-slide-in-left')
                    }
                })
            },
            { threshold: 0.2 }
        )

        if (floorRef.current) {
            observer.observe(floorRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={floorRef}
            className="relative opacity-0 mb-0 group"
            style={{ minHeight: '180px' }}
        >
            {/* Floor Number Badge */}
            <div className="absolute -left-16 top-1/2 -translate-y-1/2 bg-cyan-400 text-stone-900 border-2 border-stone-900 px-3 py-1 font-mono font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] z-10">
                F{job.floorNumber}
            </div>

            {/* Job Card */}
            <div className="relative max-w-md w-full mx-auto p-6 bg-white dark:bg-stone-900 border-2 border-stone-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                {/* Platform Badge */}
                <div className="absolute -top-3 -right-3 bg-cyan-400 text-stone-900 border-2 border-stone-900 px-3 py-1 font-mono font-bold text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
                    {job.platformId}
                </div>

                {/* Job Header */}
                <div className="mb-4">
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-2 text-stone-900 dark:text-stone-100">
                        {job.title}
                    </h3>
                    <div className="text-cyan-600 dark:text-cyan-400 font-mono font-bold text-sm uppercase tracking-widest">
                        {job.company}
                    </div>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                        <DollarSign className="w-4 h-4 text-cyan-500" strokeWidth={2.5} />
                        <span className="font-bold">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                        <MapPin className="w-4 h-4 text-cyan-500" strokeWidth={2.5} />
                        <span className="font-bold">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                        <Calendar className="w-4 h-4 text-cyan-500" strokeWidth={2.5} />
                        <span className="font-bold">{job.postedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                        <span className="text-[10px] font-mono font-black uppercase tracking-widest">
                            {job.officeAttributes.vibe}
                        </span>
                    </div>
                </div>

                {/* View Source Button */}
                <button
                    onClick={() => onViewSource(job.sourceUrl)}
                    className="w-full px-4 py-3 bg-stone-900 text-white font-display font-black uppercase tracking-widest text-sm hover:bg-cyan-400 hover:text-stone-900 transition-colors flex items-center justify-center gap-2 border-2 border-stone-900"
                >
                    View Job
                    <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    )
}
