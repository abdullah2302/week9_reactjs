import { useState, useEffect, useCallback,useMemo } from "react";
import initialProducts from "../data/products.json";
import ProductForm from "../components/ProductForm";
import FilterBar from "../components/FilterBar";
import ProductList from "../components/ProductList";
import { useCart } from "../context/CartContext";

function Products() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState(initialProducts);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const categories = ["All", ...new Set(products.map((p) => p.category))];

    const handleAddProduct = useCallback((newProduct) => {
        setProducts((prev) => [...prev, { ...newProduct, id: Date.now() }]);
    }, []);

    const handleDeleteProduct = useCallback((id) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory =
                categoryFilter === "All" || product.category === categoryFilter;
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, categoryFilter, searchTerm]);

    useEffect(() => {

        return () => {
            document.title = "Shoply";
        };
    }, [filteredProducts.length]);

    return (
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14">
            <h1 className="mb-8 text-2xl font-semibold text-slate-900">
                All Products
            </h1>

            <ProductForm onAddProduct={handleAddProduct} />

            <FilterBar
                categories={categories}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            <p className="mb-6 text-sm text-slate-500">
                Showing {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
            </p>

            <ProductList
                products={filteredProducts}
                onAddToCart={addToCart}
                onDelete={handleDeleteProduct}
            />
        </main>
    );
}

export default Products;