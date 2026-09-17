import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useCart } from "../context/CartContext";
import EmptyState from "../components/EmptyState";
import {useAuth} from "../context/AuthContext";

function Cart() {
    const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    

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
                className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-600"
            >
                Browse Products
            </Link>
           </EmptyState>
        );
    }

    const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

    return (
        <main className="mx-auto max-w-5xl px-4 py-14 ">
            <h1 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Your Cart
                <span className="ml-2 text-base font-normal text-slate-400 dark:text-slate-200">
                    ({itemCount})
                </span>
            </h1>

            <div className="mb-6 flex justify-end">
                <button
                    onClick={()=>{
                        if (!isAuthenticated) {
                            alert("User is not authenticated. Redirecting to login page.");
                            return;
                        }
                        clearCart()
                    }}
                    className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                >
                    Clear Cart
                </button>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                <div className="space-y-3 divide-slate-100 lg:col-span-2">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-wrap items-center gap-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800 sm:flex-nowrap sm:rounded-full sm:p-5"
                        >
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-700">
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

                            <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {item.name}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    {item.category}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <button
                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                    className="flex h-6 w-6 items-center justify-center text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                >
                                    −
                                </button>
                                <span className="w-4 text-center text-slate-900 dark:text-slate-100">
                                    {item.qty}
                                </span>
                                <button
                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                    className="flex h-6 w-6 items-center justify-center text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                >
                                    +
                                </button>
                            </div>

                            <span className="ml-auto shrink-0 text-right text-sm font-semibold text-slate-900 dark:text-slate-100 sm:ml-0 sm:w-16">
                                ${(item.price * item.qty).toFixed(2)}
                            </span>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="shrink-0 text-slate-500 transition hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500"
                                title="Remove item"
                            >
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                    <div className="border-t border-slate-100 pt-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0 dark:border-slate-700">
                        <div className="mb-4 flex justify-between text-sm text-slate-500  dark:text-slate-400 ">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="mb-4 flex justify-between text-sm text-slate-500 dark:text-slate-400">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="mb-6 flex justify-between border-t border-slate-100 pt-4 text-base font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <button className="w-full rounded-full bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:hover:bg-slate-300 dark:text-slate-800">
                            Proceed to Checkout
                        </button>

                        <Link
                            to="/products"
                            className="mt-4 block text-center text-xs text-slate-400 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
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