
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faCreditCard,
    faLock,
} from "@fortawesome/free-solid-svg-icons";
import { ordersApi } from "../api/ordersApi";
import { toast } from "react-toastify";



function Checkout() {
    const {
        cartItems,
        cartTotal,
        clearCart,
    } = useCart();
    const navigate = useNavigate();
    const [placingOrder, setPlacingOrder] = useState(false);
    const shipping = cartTotal >= 100 ? 0 : 10;
    const total = cartTotal + shipping;
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });

    if (cartItems.length === 0) {
        return (
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14">
                <div className="mx-auto max-w-lg text-center">
                    <h1 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-white">
                        Your cart is empty
                    </h1>

                    <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
                        Add some products to your cart before proceeding to
                        checkout.
                    </p>

                    <Link
                        to="/products"
                        className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setPlacingOrder(true);

            const orderData = {
                items: cartItems.map((item) => ({
                    product: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.qty,
                    image: item.image,
                })),

                shippingAddress: {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.postalCode,
                },

                paymentMethod: "card",

                subtotal: cartTotal,
                shipping,
                total,
            };

            const response = await ordersApi.create(orderData);

            toast.success(response.message || "Order placed successfully!");

            clearCart();

            navigate("/");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to place order"
            );
        } finally {
            setPlacingOrder(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Cart
            </button>

            <h1 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-white">
                Checkout
            </h1>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Checkout Form */}
                <section className="lg:col-span-2">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="mb-8">
                            <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                                Contact Information
                            </h2>

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Enter your contact details.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Doe"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-white"
                                />
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="my-8 border-t border-slate-200 pt-8 dark:border-slate-800">
                            <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                                Shipping Address
                            </h2>

                            <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                                Where should we deliver your order?
                            </p>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Address
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        placeholder="123 Main Street"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-white"
                                    />
                                </div>

                                <div className="grid gap-5 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            placeholder="Lahore"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            State
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            placeholder="Punjab"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Postal Code
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            placeholder="54000"
                                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="border-t border-slate-200 pt-8 dark:border-slate-800">
                            <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                                Payment
                            </h2>

                            <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                                Enter your payment information.
                            </p>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Card Number
                                    </label>

                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faCreditCard}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            required
                                            placeholder="4242 4242 4242 4242"
                                            className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Expiry Date
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                            placeholder="MM / YY"
                                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            CVV
                                        </label>

                                        <input
                                            type="password"
                                            required
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            placeholder="•••"
                                            maxLength={4}
                                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                        >
                            <FontAwesomeIcon icon={faLock} />
                            Place Order · ${total.toFixed(2)}
                        </button>
                    </form>
                </section>

                {/* Order Summary */}
                <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
                        Order Summary
                    </h2>

                    <div className="space-y-5">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-16 w-16 rounded-lg object-cover"
                                />

                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                        {item.name}
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Qty: {item.qty}
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                                        ${(item.price * item.qty).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="my-6 border-t border-slate-200 dark:border-slate-800" />

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                            <span>Shipping</span>
                            <span>
                                {shipping === 0
                                    ? "Free"
                                    : `$${shipping.toFixed(2)}`}
                            </span>
                        </div>

                        <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <p className="mt-5 text-xs leading-5 text-slate-400">
                        Your payment information is securely processed.
                    </p>
                </aside>
            </div>
        </main>
    );
}

export default Checkout;

