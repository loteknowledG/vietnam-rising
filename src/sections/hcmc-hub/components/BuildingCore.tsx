
export function BuildingCore() {
    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-32 border-x-4 border-stone-300 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 pointer-events-none">
            {/* Structural segments */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-20">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="h-[2px] w-full bg-stone-400" />
                ))}
            </div>

            {/* Central Spire Detail (Top only) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full bg-gradient-to-b from-stone-400 to-transparent opacity-30" />
        </div>
    )
}
