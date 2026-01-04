export function BuildingCoreHanoi() {
    return (
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-48 border-x-4 border-amber-300 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/50 pointer-events-none">
            {/* Structural grid typical of a modern rectangular tower */}
            <div className="absolute inset-0 grid grid-cols-4 opacity-10">
                <div className="border-r border-amber-400" />
                <div className="border-r border-amber-400" />
                <div className="border-r border-amber-400" />
            </div>

            {/* Floor segments */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-20">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="h-[1px] w-full bg-amber-600" />
                ))}
            </div>
        </div>
    )
}
