function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-10 flex items-center justify-center gap-4">
            <button
                type="button"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
            >
                Previous
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages}
            </span>
            <button
                type="button"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
