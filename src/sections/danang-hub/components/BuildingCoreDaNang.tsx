export function BuildingCoreDaNang() {
    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-48 border-x-4 border-cyan-300 dark:border-cyan-900 bg-cyan-50/50 dark:bg-cyan-950/50 pointer-events-none">
            {/* Structural grid for Landmark Tower */}
            <div className="absolute inset-0 grid grid-cols-4 opacity-10">
                <div className="border-r border-cyan-400" />
                <div className="border-r border-cyan-400" />
                <div className="border-r border-cyan-400" />
            </div>

            {/* Floor segments */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-20">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="h-[1px] w-full bg-cyan-600" />
                ))}
            </div>

            {/* Coastal wave pattern */}
            <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(6,182,212,0.1)_10px,rgba(6,182,212,0.1)_20px)]" />
        </div>
    )
}
