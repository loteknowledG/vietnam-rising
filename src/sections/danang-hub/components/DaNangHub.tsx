import { useEffect } from 'react'
import type { DaNangHubProps } from '@/../product/sections/danang-hub/types'
import { BuildingCoreDaNang } from './BuildingCoreDaNang'
import { JobFloorDaNang } from './JobFloorDaNang'
import { CityHUDDaNang } from './CityHUDDaNang'

/**
 * Da Nang Hub Main View
 * Implements a vertical ascent through Landmark Tower (Ground up) with coastal aesthetics.
 */
export function DaNangHub({
    city,
    jobs,
    onViewSource
}: DaNangHubProps) {
    // For a literal ascent (Ground at bottom, Summit at top), 
    // we want jobs sorted DESCENDING so they stack correctly in the DOM.
    const ascendingJobs = [...jobs].sort((a, b) => b.floorNumber - a.floorNumber)

    // Smart scroll: Only scroll to bottom if entering for the first time
    useEffect(() => {
        const isInternalNavigation = window.history.length > 1;
        if (!isInternalNavigation) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [])

    return (
        <div className="relative min-h-screen bg-stone-50 dark:bg-stone-950 overflow-x-hidden flex flex-col-reverse">
            {/* Ground Lobby / Entry Section (at the bottom) */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center p-4 border-t-4 border-stone-900 bg-stone-900 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(6,182,212,0.3)_20px,rgba(6,182,212,0.3)_21px)]" />

                <div className="relative z-10 text-center">
                    <div className="inline-block bg-cyan-400 text-stone-900 border-2 border-cyan-400 px-4 py-1 font-mono font-black text-sm uppercase tracking-widest mb-4 shadow-[4px_4px_0px_0px_rgba(6,182,212,1)]">
                        {city.skyscraper} LOBBY
                    </div>
                    <h1 className="text-7xl md:text-9xl font-heading font-black text-cyan-400 uppercase tracking-tighter leading-none mb-4">
                        GROUND FLOOR
                    </h1>
                    <p className="max-w-md mx-auto text-lg font-bold text-cyan-400/60 uppercase tracking-tight">
                        Coastal Base // Begin your ascent through Da Nang's future
                    </p>
                </div>

                {/* Ascent Indicator */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-1 h-12 bg-cyan-400 border border-cyan-400 animate-bounce mb-2" />
                    <span className="text-[10px] font-mono font-black uppercase animate-pulse text-cyan-400">SCROLL UP TO ASCEND</span>
                </div>
            </section>

            {/* The Ascent Container */}
            <section className="relative px-4 pt-48">
                <BuildingCoreDaNang />

                <div className="max-w-5xl mx-auto space-y-0 pb-24">
                    {ascendingJobs.map((job) => (
                        <JobFloorDaNang
                            key={job.id}
                            job={job}
                            onViewSource={onViewSource}
                        />
                    ))}
                </div>
            </section>

            {/* Floating HUD */}
            <CityHUDDaNang
                cityName={city.name}
                jobCount={jobs.length}
                activeSkyscraper={city.skyscraper}
            />

            {/* Summit Finish (at the physical top) */}
            <section className="h-screen border-b-4 border-stone-900 bg-stone-100 dark:bg-stone-900 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(6,182,212,0.2)_20px,rgba(6,182,212,0.2)_21px)]" />
                <div className="text-center relative z-10">
                    <div className="inline-block bg-cyan-400 text-stone-900 border-2 border-stone-900 px-4 py-1 font-mono font-black text-sm uppercase tracking-widest mb-4 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
                        {city.skyscraper} SUMMIT
                    </div>
                    <h1 className="text-7xl md:text-9xl font-heading font-black text-stone-900 dark:text-stone-100 uppercase tracking-tighter leading-none mb-4 drop-shadow-[8px_8px_0px_rgba(6,182,212,1)]">
                        {city.name}
                    </h1>
                    <p className="max-w-md mx-auto text-lg font-bold text-stone-500 uppercase tracking-tight">
                        69th Floor // Future icon of Central Vietnam
                    </p>
                </div>
            </section>
        </div>
    )
}
