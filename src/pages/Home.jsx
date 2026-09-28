import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { productsApi } from "../api/productsApi";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { queryKeys } from "../lib/queryKeys";

// Mongo documents use _id — flatten to id so ProductCard keeps working.
function normalize(product) {
    return { ...product, id: product._id };
}

function Home() {
    const { addToCart } = useCart();
    const { data, isPending, isError } = useQuery({
        queryKey: queryKeys.products.list({ page: 1, limit: 4 }),
        queryFn: ({ signal }) => productsApi.getAll(
            { page: 1, limit: 4 },
            { signal }
        ),
    });
    const featured = data?.products?.map(normalize) || [];

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

                {isPending ? (
                    <p className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                        Loading products...
                    </p>
                ) : isError || featured.length === 0 ? (
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