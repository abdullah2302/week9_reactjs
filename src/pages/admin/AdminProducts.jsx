import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { productsApi } from "../../api/productsApi";
import ProductForm from "../../components/ProductForm";
import ProductList from "../../components/ProductList";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";
import { queryKeys } from "../../lib/queryKeys";

function normalize(product) {
    return { ...product, id: product._id };
}

const adminProductsKey = queryKeys.products.list({ page: 1, limit: 48 });

function AdminProducts() {
    const [editingProduct, setEditingProduct] = useState(null);
    const queryClient = useQueryClient();
    const { data, isPending, isError, error } = useQuery({
        queryKey: adminProductsKey,
        queryFn: () => productsApi.getAll({ page: 1, limit: 48 }),
    });
    const products = data?.products?.map(normalize) || [];
    const createMutation = useMutation({
        mutationFn: productsApi.create,
        onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, product }) => productsApi.update(id, product),
        onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
    });

    async function handleCreate(product) {
        try {
            await createMutation.mutateAsync(product);
            toast.success("Product added");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add product");
        }
    }

    async function handleUpdate(productData) {
        try {
            await updateMutation.mutateAsync({ id: editingProduct.id, product: productData });
            setEditingProduct(null);
            toast.success("Product updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update product");
        }
    }

    const deleteMutation = useMutation({
        mutationFn: productsApi.remove,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: adminProductsKey });
            const previousData = queryClient.getQueryData(adminProductsKey);
            queryClient.setQueryData(adminProductsKey, (current) =>
                current
                    ? { ...current, products: current.products.filter((product) => product._id !== id) }
                    : current
            );
            return { previousData };
        },
        onError: (error, _id, context) => {
            queryClient.setQueryData(adminProductsKey, context?.previousData);
            toast.error(error.response?.data?.message || "Failed to delete product");
        },
        onSuccess: () => {
            toast.success("Product deleted");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
        },
    });

    function handleDelete(id) {
        if (!window.confirm("Delete this product?")) return;

        if (editingProduct?.id === id) setEditingProduct(null);
        deleteMutation.mutate(id);
    }

    return (
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14">
            <h1 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-white">
                Manage Products
            </h1>

            <ProductForm
                onAddProduct={handleCreate}
                onSubmit={handleUpdate}
                product={editingProduct}
                onCancel={() => setEditingProduct(null)}
            />

            {isPending ? (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }, (_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : isError ? (
                <p className="py-10 text-center text-sm text-red-500">
                    {error.response?.data?.message || "Failed to load products"}
                </p>
            ) : (
                <ProductList
                    products={products}
                    onDelete={handleDelete}
                    onEdit={setEditingProduct}
                />
            )}
        </main>
    );
}

export default AdminProducts;