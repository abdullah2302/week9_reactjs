
import { useEffect, useState } from "react";
import { ordersApi } from "../../api/ordersApi";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";

const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    useEffect(() => {
        loadOrders();
    }, [pagination.page]);

    const loadOrders = async () => {
        try {
            const data = await ordersApi.getAllOrders({ page: pagination.page, limit: 10 });
            setOrders(data.orders);
            setPagination(data.pagination);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load orders"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const response =
                await ordersApi.updateStatus(
                    id,
                    status
                );

            setOrders((prev) =>
                prev.map((order) =>
                    order._id === id
                        ? response.order
                        : order
                )
            );

            toast.success(
                "Order status updated"
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update status"
            );
        }
    };

    if (loading) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-14">
                <p className="text-center text-sm text-slate-500">
                    Loading orders...
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-14">
            <h1 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-white">
                Manage Orders
            </h1>

            {orders.length === 0 ? (
                <div className="rounded-xl border border-slate-200 p-8 text-center dark:border-slate-800">
                    <p className="text-slate-500">
                        No orders found.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-semibold text-slate-900 dark:text-white">
                                        Order #
                                        {order._id.slice(-8)}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Customer:{" "}
                                        {order.user?.name ||
                                            "Unknown"}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {order.user?.email}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            order._id,
                                            e.target.value
                                        )
                                    }
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm capitalize outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                >
                                    {statuses.map(
                                        (status) => (
                                            <option
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="my-5 border-t border-slate-200 dark:border-slate-800" />

                            <div className="space-y-4">
                                {order.items.map(
                                    (item) => (
                                        <div
                                            key={
                                                item.product
                                            }
                                            className="flex items-center gap-4"
                                        >
                                            <img
                                                src={
                                                    item.image
                                                }
                                                alt={
                                                    item.name
                                                }
                                                className="h-14 w-14 rounded-lg object-cover"
                                            />

                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {
                                                        item.name
                                                    }
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Qty:{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </p>
                                            </div>

                                            <p className="text-sm font-medium dark:text-white">
                                                $
                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toFixed(
                                                    2
                                                )}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">
                                        Total
                                    </span>

                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        $
                                        {order.total.toFixed(
                                            2
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
            />
        </main>
    );
}

export default AdminOrders;

