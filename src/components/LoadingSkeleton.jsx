function LoadingSkeleton({ rows = 3 }) {
    return (
        <div
            aria-busy="true"
            aria-label="Loading"
            className="mx-auto w-full max-w-6xl px-4 py-14"
        >
            <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-4">
                {Array.from({ length: rows }, (_, index) => (
                    <div
                        key={index}
                        className="h-20 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
                    />
                ))}
            </div>
        </div>
    );
}

export default LoadingSkeleton;
