const statusClasses = {
    pending: "text-amber-600 dark:text-amber-400",
    processing: "text-blue-600 dark:text-blue-400",
    shipped: "text-indigo-600 dark:text-indigo-400",
    delivered: "text-emerald-600 dark:text-emerald-400",
    cancelled: "text-red-600 dark:text-red-400",
};

export function getOrderStatusClass(status) {
    return statusClasses[status] || "text-slate-600 dark:text-slate-400";
}

export function getOrderStatusSelectClass(status) {
    const selectClasses = {
        pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
        processing: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
        shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
        delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        cancelled: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    };

    return selectClasses[status] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function OrderStatusBadge({ status }) {
    return (
        <span className={`text-xs font-medium capitalize ${getOrderStatusClass(status)}`}>
            {status}
        </span>
    );
}

export default OrderStatusBadge;
