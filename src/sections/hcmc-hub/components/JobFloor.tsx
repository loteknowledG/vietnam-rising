import { useEffect, useState, useRef } from 'react'
import { Briefcase, MapPin, Building2, Calendar, SquareArrowOutUpRight } from 'lucide-react'
import type { Job } from '@/../product/sections/hcmc-hub/types'

interface JobFloorProps {
    job: Job
    onViewSource?: (url: string) => void
}

export function JobFloor({ job, onViewSource }: JobFloorProps) {
    const [isVisible, setIsVisible] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={elementRef}
            className={`
        relative w-full py-12 flex items-center justify-center transition-all duration-700
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
        >
            {/* Dynamic Slide-in Card */}
            <div
                className={`
          max-w-md w-full bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-100 p-6 
          shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]
          transition-all duration-700 delay-100 transform
          ${isVisible ? 'translate-x-0' : (job.floorNumber % 2 === 0 ? '-translate-x-full' : 'translate-x-full')}
        `}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-fuchsia-400 text-stone-900 text-[10px] font-black uppercase tracking-widest border border-stone-900">
                        FLOOR {job.floorNumber}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-stone-500">
                        <Calendar className="w-3 h-3" />
                        {job.postedDate}
                    </div>
                </div>

                <h4 className="text-xl font-heading font-black uppercase tracking-tight mb-2 leading-none">
                    {job.title}
                </h4>

                <div className="space-y-2 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 font-bold">
                        <Building2 className="w-4 h-4 text-lime-500" />
                        {job.company}
                    </div>
                    <div className="flex items-center gap-2 text-stone-500">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-mono">
                        <Briefcase className="w-4 h-4 text-fuchsia-500" />
                        {job.salary}
                    </div>
                </div>

                {/* Future Office Attributes Visual Placeholder */}
                <div className="mb-6 p-3 bg-stone-50 dark:bg-stone-800 border border-dashed border-stone-300 dark:border-stone-700 flex justify-between items-center">
                    <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">
                        Office: {job.officeAttributes.vibe}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-lime-600">
                        FLOOR OCCUPANCY: {job.officeAttributes.occupancy}
                    </div>
                </div>

                <button
                    onClick={() => onViewSource?.(job.sourceUrl)}
                    className="w-full flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-3 border-2 border-stone-900 font-heading font-black text-xs uppercase tracking-widest hover:bg-lime-400 hover:text-stone-900 transition-all"
                >
                    View Job Source
                    <SquareArrowOutUpRight className="w-4 h-4" />
                </button>
            </div>

            {/* Building Link Detail */}
            <div className="absolute w-24 h-0.5 bg-stone-900 dark:bg-stone-100 left-1/2 -translate-x-1/2 top-1/2 opacity-20" />
        </div>
    )
}
