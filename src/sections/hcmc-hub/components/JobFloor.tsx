import { useEffect, useState, useRef } from 'react'
import { Briefcase, MapPin, Building2, Calendar, SquareArrowOutUpRight } from 'lucide-react'
import type { Job } from '@/../product/sections/hcmc-hub/types'

interface JobFloorProps {
    job: Job
    onViewSource?: (url: string) => void
}

export function JobFloor({ job, onViewSource }: JobFloorProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isFlipped, setIsFlipped] = useState(false)
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
          max-w-md w-full transition-all duration-700 delay-100 transform
          ${isVisible ? 'translate-x-0' : (job.floorNumber % 2 === 0 ? '-translate-x-full' : 'translate-x-full')}
        `}
            >
                <div className="[perspective:1000px]">
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label={`Job on floor ${job.floorNumber}. Click to flip for details.`}
                        onClick={() => setIsFlipped((v) => !v)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setIsFlipped((v) => !v)
                            }
                        }}
                        className="relative cursor-pointer transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
                    >
                        <div
                            className={`relative w-full min-h-[300px] ${isFlipped ? 'min-h-[400px]' : ''} bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-100 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] transition-transform duration-500 [transform-style:preserve-3d] ${
                                isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
                            }`}
                        >
                            {/* Front */}
                            <div className="p-6 bg-white dark:bg-stone-900 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 px-2 py-0.5 bg-fuchsia-400 text-stone-900 text-[10px] font-black uppercase tracking-widest border border-stone-900">
                                        FLOOR {job.floorNumber}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-stone-500" title={new Date(job.postedDate || '').toLocaleString()}>
                                        <Calendar className="w-3 h-3" />
                                        {new Date(job.postedDate || '').toUTCString()}
                                    </div>
                                </div>

                                <h4 className="text-xl font-heading font-black uppercase tracking-tight mb-2 leading-none text-stone-900 dark:text-stone-100">
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

                                <div className="mt-4 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                                    Click card for details
                                </div>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 p-6 bg-white dark:bg-stone-900 flex flex-col [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 px-2 py-0.5 bg-lime-400 text-stone-900 text-[10px] font-black uppercase tracking-widest border border-stone-900">
                                        DETAILS
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-stone-500" title={new Date(job.postedDate || '').toLocaleString()}>
                                        <Calendar className="w-3 h-3" />
                                        {new Date(job.postedDate || '').toUTCString()}
                                    </div>
                                </div>

                                <h4 className="text-xl font-heading font-black uppercase tracking-tight mb-2 leading-none text-stone-900 dark:text-stone-100">
                                    {job.title}
                                </h4>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 text-sm">
                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
                                        <div>
                                            Platform: <span className="text-stone-900 dark:text-stone-100">{job.platformId}</span>
                                        </div>
                                        <div>
                                            Floor: <span className="text-stone-900 dark:text-stone-100">{job.floorNumber}</span>
                                        </div>
                                        <div className="col-span-2">
                                            Job ID: <span className="text-stone-900 dark:text-stone-100 break-all">{job.id}</span>
                                        </div>
                                    </div>

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

                                    {job.details ? (
                                        <div className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                                            {job.details}
                                        </div>
                                    ) : null}

                                    <div className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest break-all">
                                        {job.sourceUrl}
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onViewSource?.(job.sourceUrl)
                                    }}
                                    className="w-full flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-3 border-2 border-stone-900 font-heading font-black text-xs uppercase tracking-widest hover:bg-lime-400 hover:text-stone-900 transition-all"
                                >
                                    View Job Source
                                    <SquareArrowOutUpRight className="w-4 h-4" />
                                </button>

                                <div className="mt-4 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                                    Click to flip back
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Building Link Detail */}
            <div className="absolute w-24 h-0.5 bg-stone-900 dark:bg-stone-100 left-1/2 -translate-x-1/2 top-1/2 opacity-20" />
        </div>
    )
}
