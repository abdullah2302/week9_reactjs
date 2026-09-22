import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { productsApi } from "../../api/productsApi";
import ProductForm from "../../components/ProductForm";
import ProductList from "../../components/ProductList";

function normalize(product) {
    return { ...product, id: product._id };
}

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadProducts() {
        try {
            const data = await productsApi.getAll({ page: 1, limit: 48 });
            setProducts(data.products.map(normalize));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load products");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    async function handleCreate(product) {
        try {
            const created = await productsApi.create(product);
            setProducts((current) => [normalize(created), ...current]);
            toast.success("Product added");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add product");
        }
    }

    async function handleUpdate(productData) {
        try {
            const updated = await productsApi.update(editingProduct.id, productData);
            setProducts((current) => current.map((product) =>
                product.id === editingProduct.id ? normalize(updated) : product
            ));
            setEditingProduct(null);
            toast.success("Product updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update product");
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this product?")) return;

        try {
            await productsApi.remove(id);
            setProducts((current) => current.filter((product) => product.id !== id));
            if (editingProduct?.id === id) setEditingProduct(null);
            toast.success("Product deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete product");
        }
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

            {loading ? (
                <p className="py-10 text-center text-sm text-slate-500">Loading products...</p>
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