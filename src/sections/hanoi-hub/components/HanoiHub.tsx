import { useEffect } from 'react'
import type { HanoiHubProps } from '@/../product/sections/hanoi-hub/types'
import { BuildingCoreHanoi } from './BuildingCoreHanoi'
import { JobFloorHanoi } from './JobFloorHanoi'
import { CityHUDHanoi } from './CityHUDHanoi'

/**
 * Hanoi Hub Main View
 * Implements a vertical ascent through Landmark 72 (Ground up).
 */
export function HanoiHub({
    city,
    jobs,
    onViewSource
}: HanoiHubProps) {
    // For a literal ascent (Ground at bottom, Summit at top), 
    // we want jobs sorted DESCENDING so they stack correctly in the DOM.
    const ascendingJobs = [...jobs].sort((a, b) => b.floorNumber - a.floorNumber)

    // We no longer force scroll to bottom here, as PortfolioLayout handles altitude sync.
    // However, we want to ensure that if a user LANDS on Hanoi directly at /hanoi, 
    // they start at the bottom (Lobby).
    useEffect(() => {
        const isInternalNavigation = window.history.length > 1;
        if (!isInternalNavigation) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [])

    return (
        <div className="relative min-h-screen bg-stone-50 dark:bg-stone-950 overflow-x-hidden flex flex-col-reverse">
            {/* Ground Lobby / Entry Section (Now the anchor at the bottom) */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center p-4 border-t-4 border-stone-900 bg-stone-900 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(245,158,11,0.3)_20px,rgba(245,158,11,0.3)_21px)]" />

                <div className="relative z-10 text-center">
                    <div className="inline-block bg-amber-400 text-stone-900 border-2 border-amber-400 px-4 py-1 font-mono font-black text-sm uppercase tracking-widest mb-4 shadow-[4px_4px_0px_0px_rgba(245,158,11,1)]">
                        {city.skyscraper} LOBBY
                    </div>
                    <h1 className="text-7xl md:text-9xl font-heading font-black text-amber-400 uppercase tracking-tighter leading-none mb-4">
                        GROUND FLOOR
                    </h1>
                    <p className="max-w-md mx-auto text-lg font-bold text-amber-400/60 uppercase tracking-tight">
                        Starting point // Begin your ascent through Hanoi's tech landscape
                    </p>
                </div>

                {/* Ascent Indicator */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-1 h-12 bg-amber-400 border border-amber-400 animate-bounce mb-2" />
                    <span className="text-[10px] font-mono font-black uppercase animate-pulse text-amber-400">SCROLL UP TO ASCEND</span>
                </div>
            </section>

            {/* The Ascent Container */}
            <section className="relative px-4 pt-48">
                <BuildingCoreHanoi />

                <div className="max-w-5xl mx-auto space-y-0 pb-24">
                    {ascendingJobs.map((job) => (
                        <JobFloorHanoi
                            key={job.id}
                            job={job}
                            onViewSource={onViewSource}
                        />
                    ))}
                </div>
            </section>

            {/* Floating HUD */}
            <CityHUDHanoi
                cityName={city.name}
                jobCount={jobs.length}
                activeSkyscraper={city.skyscraper}
            />

            {/* Summit Finish (Now at the physical top) */}
            <section className="h-screen border-b-4 border-stone-900 bg-stone-100 dark:bg-stone-900 flex items-center justify-center overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(245,158,11,0.2)_20px,rgba(245,158,11,0.2)_21px)]" />
                <div className="text-center relative z-10">
                    <div className="inline-block bg-amber-400 text-stone-900 border-2 border-stone-900 px-4 py-1 font-mono font-black text-sm uppercase tracking-widest mb-4 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
                        {city.skyscraper} SUMMIT
                    </div>
                    <h1 className="text-7xl md:text-9xl font-heading font-black text-stone-900 dark:text-stone-100 uppercase tracking-tighter leading-none mb-4 drop-shadow-[8px_8px_0px_rgba(245,158,11,1)]">
                        {city.name}
                    </h1>
                    <p className="max-w-md mx-auto text-lg font-bold text-stone-500 uppercase tracking-tight">
                        Summit of Vietnam's capital tech scene.
                    </p>
                </div>
            </section>
        </div>
    )
}
