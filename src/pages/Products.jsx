import { useState, useEffect, useCallback, useMemo } from "react";
import { productsApi } from "../api/productsApi";
import ProductForm from "../components/ProductForm";
import FilterBar from "../components/FilterBar";
import ProductList from "../components/ProductList";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
function normalize(product) {
    return { ...product, id: product._id };
}


const productsCache = new Map();

function cacheKey(params) {
    return JSON.stringify(params);
}

function Products() {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedSearch(searchTerm.trim());
        }, 350);

        return () => window.clearTimeout(timeoutId);
    }, [searchTerm]);

    const requestParams = useMemo(
        () => ({
            page: pagination.page,
            limit: 12,
            search: debouncedSearch,
            category: categoryFilter,
        }),
        [pagination.page, debouncedSearch, categoryFilter]
    );

    useEffect(() => {
        const controller = new AbortController();
        const key = cacheKey(requestParams);
        const cached = productsCache.get(key);

        if (cached) {
          
            setProducts(cached.products.map(normalize));
            setCategories(["All", ...cached.categories]);
            setPagination(cached.pagination);
            setError("");
            setLoading(false);
        } else {
            setLoading(true);
            setError("");
        }

        productsApi
            .getAll(requestParams, { signal: controller.signal })
            .then((data) => {
                productsCache.set(key, data);
                setProducts(data.products.map(normalize));
                setCategories(["All", ...data.categories]);
                setPagination(data.pagination);
            })
            .catch((err) => {
                if (err.name !== "CanceledError" && err.name !== "AbortError") {
                    
                    if (!cached) setError(err.message);
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [requestParams]);

    const handleAddProduct = useCallback(async (newProduct) => {
        const created = await productsApi.create(newProduct);
        setProducts((prev) => [...prev, normalize(created)]);
        productsCache.clear(); // stale now — next visit should refetch
    }, []);

    const handleDeleteProduct = useCallback(async (id) => {
        await productsApi.remove(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        productsCache.clear();
    }, []);

    const handleCategoryChange = useCallback((category) => {
        setCategoryFilter(category);
        setPagination((current) => ({ ...current, page: 1 }));
    }, []);

    const handleSearchChange = useCallback((search) => {
        setSearchTerm(search);
        setPagination((current) => ({ ...current, page: 1 }));
    }, []);

    useEffect(() => {
        document.title = `Products (${pagination.total}) · Shoply`;

        return () => {
            document.title = "Shoply";
        };
    }, [pagination.total]);



    return (
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14">
            <h1 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-white">
                All Products
            </h1>


           

            <FilterBar
                categories={categories}
                categoryFilter={categoryFilter}
                onCategoryChange={handleCategoryChange}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />

            {loading ? (
                <p className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                    Loading products...
                </p>
            ) : error ? (
                <p className="py-10 text-center text-sm text-red-500">{error}</p>
            ) : (
                <>
                    <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                        Showing {products.length} of {pagination.total} products
                    </p>

                    <ProductList
                        products={products}
                        onAddToCart={addToCart}
                        onDelete={
                            user?.role === "admin"
                                ? handleDeleteProduct
                                : undefined
                        }
                    />
                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
                    />
                </>
            )}
        </main>
    );
}

export default Products;