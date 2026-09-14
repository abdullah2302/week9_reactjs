import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useCart } from "../context/CartContext";
import EmptyState from "../components/EmptyState";

function Cart() {
    const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
           <EmptyState>
            <FontAwesomeIcon
                icon={faCartShopping}
                className="mb-4 text-3xl text-slate-300"
            />
            <p className="mb-6 text-slate-500">Your cart is empty.</p>
            <Link
                to="/products"
                className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
            >
                Browse Products
            </Link>
           </EmptyState>
        );
    }

    const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

    return (
        <main className="mx-auto max-w-5xl px-4 py-14 ">
            <h1 className="mb-8 text-2xl font-semibold text-slate-900">
                Your Cart
                <span className="ml-2 text-base font-normal text-slate-400">
                    ({itemCount})
                </span>
            </h1>

            <div className="grid gap-10 lg:grid-cols-3">
                <div className="space-y-3 divide-slate-100  lg:col-span-2">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center bg-slate-100 rounded-full gap-4 p-5 h-20"
                        >
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-slate-900">
                                    {item.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {item.category}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <button
                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                    className="flex h-6 w-6 items-center justify-center text-slate-500 transition hover:text-slate-900"
                                >
                                    −
                                </button>
                                <span className="w-4 text-center text-slate-900">
                                    {item.qty}
                                </span>
                                <button
                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                    className="flex h-6 w-6 items-center justify-center text-slate-500 transition hover:text-slate-900"
                                >
                                    +
                                </button>
                            </div>

                            <span className="w-16 shrink-0 text-right text-sm font-semibold text-slate-900">
                                ${(item.price * item.qty).toFixed(2)}
                            </span>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-slate-500 transition hover:text-red-500"
                                title="Remove item"
                            >
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                    <div className="border-t border-slate-100 pt-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                        <div className="mb-4 flex justify-between text-sm text-slate-500">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="mb-4 flex justify-between text-sm text-slate-500">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="mb-6 flex justify-between border-t border-slate-100 pt-4 text-base font-semibold text-slate-900">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <button className="w-full rounded-full bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-700">
                            Proceed to Checkout
                        </button>

                        <Link
                            to="/products"
                            className="mt-4 block text-center text-xs text-slate-400 transition hover:text-slate-900"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Cart;