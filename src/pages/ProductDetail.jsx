import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCartPlus, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import initialProducts from "../data/products.json";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

   

    const product = initialProducts.find((p) => p.id === Number(id));

     useEffect(() => {
    if (!product) return;

    document.title = `${product.name} · Shoply`;

    return () => {
        document.title = "Shoply";
    };
}, [product]);

    if (!product) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-24 text-center">
                <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="mb-4 text-3xl text-slate-300"
                />
                <p className="mb-4 text-slate-500">Product not found.</p>
                <Link to="/products" className="text-sm text-slate-900 underline">
                    Back to products
                </Link>
            </div>
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
                <div className="aspect-square overflow-hidden rounded-lg bg-slate-50">
                    {product.image && (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
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

                    <div className="mb-8 text-3xl font-semibold text-slate-900">
                        ${product.price}
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                        <FontAwesomeIcon icon={faCartPlus} />
                        Add to Cart
                    </button>

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