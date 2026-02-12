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
        <div className="relative min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-stone-950 overflow-x-hidden text-stone-100">
            {/* City Hero / Spire Section */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center p-4 border-b-2 border-fuchsia-900/30 overflow-hidden">
                {/* Abstract Architectural Background Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full border-l border-white/5 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(255,255,255,0.03)_20px,rgba(255,255,255,0.03)_40px)]" />

                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
                    <div className="inline-block bg-fuchsia-500 text-white border border-fuchsia-400 px-4 py-1 font-mono font-black text-sm uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                        {city.skyscraper} SPIRE
                    </div>
                    <h1 className="text-7xl md:text-9xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-400 uppercase tracking-tighter leading-none mb-4 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                        {city.name}
                    </h1>
                    <p className="max-w-md mx-auto text-lg font-bold text-fuchsia-200 uppercase tracking-tight shadow-black drop-shadow-md">
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
