import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { productsApi } from "../api/productsApi";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

// Mongo documents use _id — flatten to id so ProductCard keeps working.
function normalize(product) {
    return { ...product, id: product._id };
}

function Home() {
    const { addToCart } = useCart();
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        // Only ask the API for the first 4 — no point fetching every
        // product just to slice it down client-side.
        productsApi
            .getAll({ page: 1, limit: 4 }, { signal: controller.signal })
            .then((data) => setFeatured(data.products.map(normalize)))
            .catch((err) => {
                if (err.name !== "CanceledError" && err.name !== "AbortError") {
                    setFeatured([]);
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    return (
        <>
            <Hero />

            <section className="mx-auto max-w-6xl px-4 py-16">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        Featured Products
                    </h2>

                    <Link
                        to="/products"
                        className="text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                        View all →
                    </Link>
                </div>

                {loading ? (
                    <p className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                        Loading products...
                    </p>
                ) : featured.length === 0 ? (
                    <p className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                        No products available right now.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
                        {featured.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default Home;