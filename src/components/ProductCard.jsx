import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faTrash, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product, onAddToCart, onDelete }) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const inStock = product.inStock !== false;
    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        onAddToCart(product);
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-shadow duration-200 hover:shadow-md transition-transform duration-200 hover:-translate-y-1">
            <Link to={`/products/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-white">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className={`h-full w-full object-cover transition-transform duration-300 ${
                                !inStock ? "opacity-50 grayscale" : ""
                            }`}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : null}

                    {!inStock && (
                        <span className="absolute left-2 top-2 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Out of Stock
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-3">
                <Link to={`/products/${product.id}`}>
                    <h3 className="truncate text-sm font-medium text-slate-900">
                        {product.name}
                    </h3>
                </Link>
                <p className="mt-0.5 text-xs text-slate-400">
                    {product.category}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                        ${product.price}
                    </span>

                    <div className="flex items-center gap-2">
                        {inStock ? (
                            <button
                                onClick={handleAddToCart}
                                className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700"
                            >
                                <FontAwesomeIcon icon={faCartPlus} className="text-xs" />
                                Add
                            </button>
                        ) : (
                            <button
                                onClick={handleWishlistToggle}
                                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                    inWishlist
                                        ? "border-red-200 bg-red-50 text-red-500"
                                        : "border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900"
                                }`}
                            >
                                <FontAwesomeIcon icon={faHeart} className="text-xs" />
                                {inWishlist ? "Wishlisted" : "Wishlist"}
                            </button>
                        )}

                        {onDelete && (
                            <button
                                onClick={() => onDelete(product.id)}
                                aria-label="Remove product"
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                            >
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;