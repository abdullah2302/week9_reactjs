
import { useEffect, useState } from "react";
import { ordersApi } from "../../api/ordersApi";
import { reviewsApi } from "../../api/reviewsApi";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import ReviewModal from "../../components/ReviewModal";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [reviewedKeys, setReviewedKeys] = useState(new Set());
    const [reviewTarget, setReviewTarget] = useState(null);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const [data, reviews] = await Promise.all([
                    ordersApi.getMyOrders({ page: pagination.page, limit: 10 }),
                    reviewsApi.getMyReviews(),
                ]);
                setOrders(data.orders);
                setPagination(data.pagination);
                setReviewedKeys(new Set(reviews.map((review) => `${review.order}:${review.product}`)));
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load orders"
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [pagination.page]);

    if (loading) {
        return (
            <div className="py-10 text-center text-sm text-slate-500">
                Loading orders...
            </div>
        );
    }

    return (
        <div>
            <h1 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-white">
                My Orders
            </h1>

            {orders.length === 0 ? (
                <div className="rounded-xl border border-slate-200 p-8 text-center dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400">
                        You haven't placed any orders yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Order #{order._id.slice(-8)}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <OrderStatusBadge status={order.status} />
                            </div>

                            <div className="space-y-4">
                                {order.items.map((item) => {
                                    const productId = item.product?._id || item.product;
                                    const reviewKey = `${order._id}:${productId}`;
                                    const reviewed = reviewedKeys.has(reviewKey);
                                    return (
                                    <div
                                        key={productId}
                                        className="flex items-center gap-4"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-16 w-16 rounded-lg object-cover"
                                        />

                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                                                {item.name}
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            {order.status === "delivered" && (
                                                reviewed ? (
                                                    <span className="mt-1 block text-xs text-emerald-600 dark:text-emerald-400">Reviewed</span>
                                                ) : (
                                                    <button onClick={() => setReviewTarget({ orderId: order._id, product: { ...item, _id: productId } })} className="mt-1 text-xs font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                                                        Review Product
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">
                                        Total
                                    </span>

                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        ${order.total.toFixed(2)}
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
            {reviewTarget && (
                <ReviewModal
                    orderId={reviewTarget.orderId}
                    product={reviewTarget.product}
                    onClose={() => setReviewTarget(null)}
                    onSubmitted={() => {
                        setReviewedKeys((current) => new Set([...current, `${reviewTarget.orderId}:${reviewTarget.product._id}`]));
                        setReviewTarget(null);
                        toast.success("Review submitted");
                    }}
                />
            )}
        </div>
    );
}

export default Orders;

