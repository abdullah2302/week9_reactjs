import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import EmptyState from "../components/EmptyState";

function Wishlist() {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlistItems.length === 0) {
        return (
            <EmptyState>
                <FontAwesomeIcon
                    icon={faHeart}
                    className="mb-4 text-3xl text-slate-300"
                />
                <p className="mb-6 text-slate-500">Your wishlist is empty.</p>
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
        <main className="mx-auto max-w-5xl px-4 py-14">
            <h1 className="mb-8 text-2xl font-semibold text-slate-900">
                Your Wishlist
                <span className="ml-2 text-base font-normal text-slate-400">
                    ({wishlistItems.length})
                </span>
            </h1>

            <div className="divide-y divide-slate-100">
                {wishlistItems.map((item) => {
                    const inStock = item.inStock !== false;

                    return (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 py-5"
                        >
                            <Link
                                to={`/products/${item.id}`}
                                className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-50"
                            >
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={`h-full w-full object-cover ${
                                            !inStock ? "opacity-50 grayscale" : ""
                                        }`}
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                )}
                            </Link>

                            <div className="min-w-0 flex-1">
                                <Link to={`/products/${item.id}`}>
                                    <p className="truncate text-sm font-medium text-slate-900">
                                        {item.name}
                                    </p>
                                </Link>
                                <p className="text-xs text-slate-400">
                                    {item.category}
                                </p>
                                {!inStock && (
                                    <p className="mt-0.5 text-xs font-medium text-red-500">
                                        Out of stock
                                    </p>
                                )}
                            </div>

                            <span className="shrink-0 text-sm font-semibold text-slate-900">
                                ${item.price}
                            </span>

                            {inStock && (
                                <button
                                    onClick={() => addToCart(item)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                    title="Add to cart"
                                >
                                    <FontAwesomeIcon icon={faCartPlus} className="text-sm" />
                                </button>
                            )}

                            <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="text-slate-300 transition hover:text-red-500"
                                title="Remove from wishlist"
                            >
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}

export default Wishlist;