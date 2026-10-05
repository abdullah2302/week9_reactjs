function ProductDetailSkeleton() {
    return (
        <main
            aria-busy="true"
            aria-label="Loading product"
            className="mx-auto max-w-5xl rounded-lg bg-slate-50 px-4 py-14 dark:bg-slate-800/60"
        >
            <div className="mb-8 h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

            <div className="grid gap-12 sm:grid-cols-2">
                <div className="aspect-square animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />

                <div className="flex flex-col">
                    <div className="mb-3 h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mb-5 h-8 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mb-2 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mb-2 h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mb-8 h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mb-6 h-9 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="h-12 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
            </div>
        </main>
    );
}

export default ProductDetailSkeleton;
