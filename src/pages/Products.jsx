import { useState, useEffect, useMemo, useCallback } from "react";
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { productsApi } from "../api/productsApi";
import FilterBar from "../components/FilterBar";
import ProductList from "../components/ProductList";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import { queryKeys } from "../lib/queryKeys";

function normalize(product) {
    return { ...product, id: product._id };
}

function Products() {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const queryClient = useQueryClient();

    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0,
    });
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedSearch(searchTerm);
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

    const { data, isPending, isError, error } = useQuery({
        queryKey: queryKeys.products.list(requestParams),
        queryFn: ({ signal }) => productsApi.getAll(requestParams, { signal }),
        placeholderData: keepPreviousData,
    });

    // Stable array identity: only changes when the API payload changes,
    // NOT on every cart-driven re-render of this component.
    const products = useMemo(
        () => data?.products?.map(normalize) ?? [],
        [data?.products]
    );

    const categories = useMemo(
        () => ["All", ...(data?.categories || [])],
        [data?.categories]
    );

    const visiblePagination = data?.pagination || pagination;

    const deleteProductMutation = useMutation({
        mutationFn: productsApi.remove,
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
    });

    // Depend on the stable `mutate` reference (not the mutation object).
    const { mutate: deleteMutate } = deleteProductMutation;
    const handleDeleteProduct = useCallback(
        (id) => deleteMutate(id),
        [deleteMutate]
    );

    const handleCategoryChange = useCallback((category) => {
        setCategoryFilter(category);
        setPagination((current) => ({ ...current, page: 1 }));
    }, []);

    const handleSearchChange = useCallback((search) => {
        setSearchTerm(search);
        setPagination((current) => ({ ...current, page: 1 }));
    }, []);

    const handlePageChange = useCallback((page) => {
        setPagination((current) => ({ ...current, page }));
    }, []);

    // `addToCart` is already referentially stable from CartContext.
    // Pick a stable onDelete value so ProductList's memo can skip.
    const isAdmin = user?.role === "admin";
    const onDelete = isAdmin ? handleDeleteProduct : undefined;

    useEffect(() => {
        document.title = `Products (${visiblePagination.total}) · Shoply`;

        return () => {
            document.title = "Shoply";
        };
    }, [visiblePagination.total]);

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

            {isPending ? (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }, (_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : isError ? (
                <p className="py-10 text-center text-sm text-red-500">
                    {error.message}
                </p>
            ) : (
                <>
                    <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                        Showing {products.length} of {visiblePagination.total}{" "}
                        products
                    </p>

                    <ProductList
                        products={products}
                        onAddToCart={addToCart}
                        onDelete={onDelete}
                    />

                    <Pagination
                        page={visiblePagination.page}
                        totalPages={visiblePagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </main>
    );
}

export default Products;