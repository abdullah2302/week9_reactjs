import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCartPlus, faCircleExclamation, faHeart } from '@fortawesome/free-solid-svg-icons';
import initialProducts from "../data/products.json";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useEffect } from "react";
import EmptyState from "../components/EmptyState";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, updateQty, cartItems } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const product = initialProducts.find((p) => p.id === Number(id));

    // Safe even when product is undefined (see the !product check below) —
    // avoids crashing on product.id before we know product exists.
    const cartItem = product
        ? cartItems.find((item) => item.id === product.id)
        : null;
    const quantity = cartItem?.qty || 0;

    const inStock = product ? product.inStock !== false : true;
    const inWishlist = product ? isInWishlist(product.id) : false;

    function handleWishlistToggle() {
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    }

    useEffect(() => {
        if (!product)
            return;

        document.title = `${product.name} · Shoply`;

        return () => {
            document.title = "Shoply";
        };
    }, [product]);

    if (!product) {
        return (
            <EmptyState>
                <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="mb-4 text-3xl text-slate-300"
                />
                <p className="mb-6 text-slate-500">Product not found.</p>
                <Link
                    to="/products"
                    className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                    Browse Products
                </Link>
            </EmptyState>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-14 bg-slate-50 rounded-lg">
            <button
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                Back
            </button>

            <div className="grid gap-12 sm:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-50">
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
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                        {product.category}
                    </p>
                    <h1 className="mb-4 text-2xl font-semibold text-slate-900">
                        {product.name}
                    </h1>
                    <p className="mb-6 leading-relaxed text-slate-500">
                        {product.description}
                    </p>

                    <div className="mb-4 text-3xl font-semibold text-slate-900">
                        ${product.price}
                    </div>

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
                                    ? "border-red-200 bg-red-50 text-red-500"
                                    : "border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900"
                            }`}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                            {inWishlist ? "Added to Wishlist" : "Add to Wishlist"}
                        </button>
                    ) : quantity === 0 ? (
                        <button
                            onClick={() => addToCart(product)}
                            className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                        >
                            <FontAwesomeIcon icon={faCartPlus} />
                            Add to Cart
                        </button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => updateQty(product.id, quantity - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900"
                            >
                                −
                            </button>

                            <span className="w-5 text-center font-medium">
                                {quantity}
                            </span>

                            <button
                                onClick={() => updateQty(product.id, quantity + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900"
                            >
                                +
                            </button>
                        </div>
                    )}
                    <div className="mt-8 space-y-2 border-t border-slate-100 pt-6 text-sm text-slate-500">
                        <p>Free delivery on orders over $50</p>
                        <p>1-year warranty included</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProductDetail;