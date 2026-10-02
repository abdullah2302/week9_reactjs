function ProductCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
        >
            <div className="aspect-square animate-pulse bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-3 p-3">
                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-2/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center justify-between pt-2">
                    <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-8 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
            </div>
        </div>
    );
}

export default ProductCardSkeleton;
