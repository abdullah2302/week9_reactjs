import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import initialProducts from "../data/products.json";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

function Home() {
    const { addToCart } = useCart();
    const featured = initialProducts.slice(0, 4);

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
                        className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
                    >
                        View all →
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
                    {featured.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}

export default Home;