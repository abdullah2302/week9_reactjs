import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartPlus,
    faTrash,
    faHeart,
    faPen,
} from "@fortawesome/free-solid-svg-icons";

import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function ProductCard({ product, onAddToCart, onDelete, onEdit }) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const inStock = product.inStock !== false && (
        product.stockQuantity === undefined || product.stockQuantity > 0
    );
    const inWishlist = isInWishlist(product.id);
    const linkTo = `/products/${product.id}`;
    console.log(linkTo);

    const handleAddToCart = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
        navigate("/login", { state: { from: location } });
        return;
    }

    onAddToCart(product);
    toast.success(`${product.name} added to cart`);
};

    const handleWishlistToggle = (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }

        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="group overflow-hidden rounded-xl border border-slate-300 bg-slate-50  hover:translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">

            {/* Product Image */}
            <Link to={linkTo} className="block">
                <div className="relative aspect-square overflow-hidden bg-white dark:bg-slate-900">

                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className={`h-full w-full object-cover transition-transform duration-300  ${
                                !inStock ? "opacity-50 grayscale" : ""
                            }`}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : null}

                    <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        inStock
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    }`}>
                        {inStock ? "In Stock" : "Out of Stock"}
                    </span>
                </div>
            </Link>

            {/* Product Information */}
            <div className="p-3">

                <Link to={`/products/${product.id}`}>
                    <h3 className="truncate text-sm font-medium text-slate-900 transition hover:text-indigo-500 dark:text-white dark:hover:text-indigo-400">
                        {product.name}
                    </h3>
                </Link>

                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-400">
                    {product.category}
                </p>

                {onEdit && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Quantity: {product.stockQuantity ?? "-"}
                    </p>
                )}

                <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2">

                    {/* Price */}
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        ${product.price}
                    </span>

                    <div className="flex items-center flex-wrap items-center justify-center gap-2">

                        {/* Add to Cart / Wishlist */}
                        {onAddToCart && inStock ? (
                            <button
                                onClick={handleAddToCart}
                                className="flex items-center shrink-0 gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                            >
                                <FontAwesomeIcon
                                    icon={faCartPlus}
                                    className="text-xs"
                                />
                                Add
                            </button>
                        ) : onAddToCart ? (
                            <button
                                onClick={handleWishlistToggle}
                                className={`flex items-center shrink-0 gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                    inWishlist
                                        ? "border-red-200 bg-red-50 text-red-500 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
                                        : "border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-white dark:hover:text-white"
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    className="text-xs"
                                />

                                {inWishlist ? "Wishlisted" : "Wishlist"}
                            </button>
                        ) : null}

                        {/* Delete */}
                        {onDelete && (
                            <>
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(product)}
                                    aria-label={`Edit ${product.name}`}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-600 dark:hover:border-white dark:hover:text-white"
                                >
                                    <FontAwesomeIcon icon={faPen} className="text-sm" />
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(product.id)}
                                aria-label="Remove product"
                                className="flex h-8 w-8 items-center shrink-0 justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-600 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-400 overflow-hidden"
                            >
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="text-sm"
                                />
                            </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;