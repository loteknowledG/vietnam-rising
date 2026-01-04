import type { HCMCHubProps } from '@/../product/sections/hcmc-hub/types'
import { BuildingCore } from './BuildingCore'
import { JobFloor } from './JobFloor'
import { CityHUD } from './CityHUD'

/**
 * HCMC Hub Main View
 * Implements a vertical descent through Landmark 81 with job listings sliding in as floors.
 */
export function HCMCHub({
    city,
    jobs,
    onViewSource
}: HCMCHubProps) {
    return (
        <div className="relative min-h-screen bg-stone-50 dark:bg-stone-950 overflow-x-hidden">
            {/* City Hero / Spire Section */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center p-4 border-b-2 border-stone-900 bg-stone-100 dark:bg-stone-900 overflow-hidden">
                {/* Abstract Architectural Background Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full border-l-2 border-stone-200 dark:border-stone-800 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(0,0,0,0.02)_20px,rgba(0,0,0,0.02)_40px)]" />

                <div className="relative z-10 text-center">
                    <div className="inline-block bg-fuchsia-400 text-stone-900 border-2 border-stone-900 px-4 py-1 font-mono font-black text-sm uppercase tracking-widest mb-4 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
                        {city.skyscraper} SPIRE
                    </div>
                    <h1 className="text-7xl md:text-9xl font-heading font-black text-stone-900 dark:text-stone-100 uppercase tracking-tighter leading-none mb-4 drop-shadow-[8px_8px_0px_rgba(163,230,53,1)]">
                        {city.name}
                    </h1>
                    <p className="max-w-md mx-auto text-lg font-bold text-stone-500 uppercase tracking-tight">
                        Descending through the floors of Vietnam's React development market.
                    </p>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center">
                    <span className="text-[10px] font-mono font-black uppercase mb-2">SCROLL TO DESCEND</span>
                    <div className="w-1 h-12 bg-lime-400 border border-stone-900" />
                </div>
            </section>

            {/* The Descent Container */}
            <section className="relative px-4 pb-48">
                <BuildingCore />

                <div className="max-w-5xl mx-auto space-y-0 pt-24">
                    {jobs.map((job) => (
                        <JobFloor
                            key={job.id}
                            job={job}
                            onViewSource={onViewSource}
                        />
                    ))}
                </div>
            </section>

            {/* Floating HUD */}
            <CityHUD
                cityName={city.name}
                jobCount={jobs.length}
                activeSkyscraper={city.skyscraper}
            />

            {/* Ground Floor Finish */}
            <section className="h-[40vh] border-t-4 border-stone-900 bg-stone-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lime-400 text-6xl font-heading font-black uppercase mb-2">GROUND FLOOR</div>
                    <div className="text-stone-500 font-mono font-bold tracking-widest uppercase">ALL LISTINGS VIEWED // HCMC HUB</div>
                </div>
            </section>
        </div>
    )
}
