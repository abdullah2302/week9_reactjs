import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCartPlus, faCircleExclamation, faComments, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { productsApi } from "../api/productsApi";
import { reviewsApi } from "../api/reviewsApi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart, updateQty, cartItems } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.role === "admin";

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [reviewData, setReviewData] = useState({ reviews: [], summary: { average: 0, total: 0, distribution: [] } });

    useEffect(() => {
        setLoading(true);
        setNotFound(false);

        productsApi
            .getById(id)
            .then((data) => setProduct({ ...data, id: data._id }))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!product) return;

        reviewsApi
            .getProductReviews(product.id)
            .then(setReviewData)
            .catch(() => setReviewData({ reviews: [], summary: { average: 0, total: 0, distribution: [] } }));
    }, [product]);

    const cartItem = product
        ? cartItems.find((item) => item.id === product.id)
        : null;
    const quantity = cartItem?.qty || 0;

    const inStock = product ? product.inStock !== false && (
        product.stockQuantity === undefined || product.stockQuantity > 0
    ) : true;
    const inWishlist = product ? isInWishlist(product.id) : false;

    const handleWishlistToggle = useCallback(() => {
    if (!product) return;

    if (inWishlist) {
        removeFromWishlist(product.id);
    } else {
        addToWishlist(product);
    }
}, [
    product,
    inWishlist,
    addToWishlist,
    removeFromWishlist,
]);

const handleAddToCart = useCallback(() => {
    if (!product || isAdmin) return;

    if (!isAuthenticated) {
        navigate("/login", { state: { from: location } });
        return;
    }

    addToCart(product);
}, [
    product,
    isAuthenticated,
    isAdmin,
    navigate,
    location,
    addToCart,
]);

    function handleAskAdmin() {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }

        window.dispatchEvent(new CustomEvent("chat:open", {
            detail: {
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                },
            },
        }));
    }

    useEffect(() => {
        if (!product) return;

        document.title = `${product.name} · Shoply`;

        return () => {
            document.title = "Shoply";
        };
    }, [product]);

    if (loading) {
        return (
            <p className="py-24 text-center text-sm text-slate-400 dark:text-slate-500">
                Loading...
            </p>
        );
    }

    if (notFound || !product) {
        return (
            <EmptyState>
                <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="mb-4 text-3xl text-slate-300"
                />
                <p className="mb-6 text-slate-500 dark:text-slate-400">Product not found.</p>
                <Link
                    to="/products"
                    className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                    Browse Products
                </Link>
            </EmptyState>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-14 bg-slate-50 rounded-lg dark:bg-slate-800/60">
            <button
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                Back
            </button>

            <div className="grid gap-12 sm:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-900">
                    {product.image && (
                        <img
                            src={product.image}
                            alt={product.name}
                            className={`h-full w-full object-cover ${
                                !inStock ? "opacity-50 grayscale" : ""
                            }`}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    )}

                    {!inStock && (
                        <span className="absolute left-3 top-3 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Out of Stock
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        {product.category}
                    </p>
                    <h1 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-white">
                        {product.name}
                    </h1>
                    <p className="mb-6 leading-relaxed text-slate-500 dark:text-slate-400">
                        {product.description}
                    </p>

                    <div className="mb-4 text-3xl font-semibold text-slate-900 dark:text-white">
                        ${product.price}
                    </div>

                    {inStock && product.stockQuantity !== undefined && (
                        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                            {product.stockQuantity} available
                        </p>
                    )}

                    {!inStock && (
                        <p className="mb-4 text-sm font-medium text-red-500">
                            Currently out of stock
                        </p>
                    )}

                    {!inStock ? (
                        <button
                            onClick={handleWishlistToggle}
                            className={`flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition ${
                                inWishlist
                                    ? "border-red-200 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
                                    : "border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-white dark:hover:text-white"
                            }`}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                            {inWishlist ? "Added to Wishlist" : "Add to Wishlist"}
                        </button>
                    ) : isAdmin ? (
                        <p className="rounded-full border border-slate-200 px-6 py-3 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            Admin accounts cannot add products to cart.
                        </p>
                    ) : quantity === 0 ? (
                        <button
                            onClick={handleAddToCart}
                            className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                        >
                            <FontAwesomeIcon icon={faCartPlus} />
                            Add to Cart
                        </button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => updateQty(product.id, quantity - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                            >
                                −
                            </button>

                            <span className="w-5 text-center font-medium dark:text-white">
                                {quantity}
                            </span>

                            <button
                                onClick={() => updateQty(product.id, quantity + 1)}
                                disabled={product.stockQuantity !== undefined && quantity >= product.stockQuantity}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                            >
                                +
                            </button>
                        </div>
                    )}

                    {!isAdmin && (
                        <button
                            onClick={handleAskAdmin}
                            className="mt-3 flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-white dark:hover:text-white"
                        >
                            <FontAwesomeIcon icon={faComments} />
                            Ask admin about this product
                        </button>
                    )}
                    <div className="mt-8 space-y-2 border-t border-slate-100 pt-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                        <p>Free delivery on orders over $50</p>
                        <p>1-year warranty included</p>
                    </div>
                </div>
            </div>

            <section className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-700">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Customer Reviews</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {reviewData.summary.total === 0
                                ? "No reviews yet. Be the first to review this product."
                                : `${reviewData.summary.total} review${reviewData.summary.total === 1 ? "" : "s"}`}
                        </p>
                    </div>
                    {reviewData.summary.total > 0 && (
                        <div className="flex items-center gap-2 text-amber-400">
                            <span className="text-2xl font-semibold text-slate-900 dark:text-white">{reviewData.summary.average}</span>
                            <span className="flex gap-0.5">{[1, 2, 3, 4, 5].map((star) => <FontAwesomeIcon key={star} icon={faStar} className={star <= Math.round(reviewData.summary.average) ? "" : "text-slate-300 dark:text-slate-600"} />)}</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">/ 5</span>
                        </div>
                    )}
                </div>

                {reviewData.summary.total > 0 && (
                    <div className="mb-8 max-w-sm space-y-2">
                        {reviewData.summary.distribution.map((entry) => (
                            <div key={entry.rating} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="w-8">{entry.rating} star</span>
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${(entry.count / reviewData.summary.total) * 100}%` }} />
                                </div>
                                <span className="w-5 text-right">{entry.count}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {reviewData.reviews.map((review) => (
                        <article key={review._id} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{review.user?.name || "Customer"}</p>
                                    <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className="flex gap-0.5 text-amber-400">{[1, 2, 3, 4, 5].map((star) => <FontAwesomeIcon key={star} icon={faStar} className={star <= review.rating ? "" : "text-slate-300 dark:text-slate-600"} />)}</span>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{review.comment}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default ProductDetail;