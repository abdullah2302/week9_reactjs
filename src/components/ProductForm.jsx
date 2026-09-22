import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';

function ProductForm({ onAddProduct, onSubmit, product, onCancel }) {
    const [name, setName] = useState(product?.name || "");
    const [description, setDescription] = useState(product?.description || "");
    const [category, setCategory] = useState(product?.category || "");
    const [price, setPrice] = useState(product?.price ?? "");
    const [image, setImage] = useState(product?.image || null);
    const [inStock, setInStock] = useState(product?.inStock !== false);
    const [stockQuantity, setStockQuantity] = useState(
        product?.stockQuantity ?? (product?.inStock === false ? 0 : 1)
    );

    useEffect(() => {
        setName(product?.name || "");
        setDescription(product?.description || "");
        setCategory(product?.category || "");
        setPrice(product?.price ?? "");
        setImage(product?.image || null);
        setInStock(product?.inStock !== false);
        setStockQuantity(product?.stockQuantity ?? (product?.inStock === false ? 0 : 1));
    }, [product]);

     function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim() || !category.trim() || !price || stockQuantity < 0) {
            alert("Please fill all fields");
            return;
        }

        const productData = {
            name: name.trim(),
            description: description.trim(),
            category: category.trim(),
            price: Number(price),
            image: image,
            inStock,
            stockQuantity: Number(stockQuantity),
        };

        if (product && onSubmit) {
            onSubmit(productData);
        } else {
            onAddProduct(productData);
        }

        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setImage(null);
        setInStock(true);
        setStockQuantity(1);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-10 flex flex-wrap items-end gap-3 border-b border-slate-100 pb-8 dark:border-slate-700"
        >
            <div className="flex-1 basis-full">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-200">
                    {product ? "Edit Product" : "Add Product"}
                </p>
            </div>

            <input
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-w-[140px] flex-1 border-b border-slate-200 bg-transparent px-1 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:focus:border-slate-400 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:placeholder-slate-300"
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-w-[140px] flex-1 border-b border-slate-200 bg-transparent px-1 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:focus:border-slate-400 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:placeholder-slate-300"
            />

            <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="min-w-[140px] flex-1 border-b border-slate-200 bg-transparent px-1 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:focus:border-slate-400 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:placeholder-slate-300"
            />

            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="min-w-[100px] flex-1 border-b border-slate-200 bg-transparent px-1 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:focus:border-slate-400 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:placeholder-slate-300"
            />
            <label className="flex items-center gap-2 px-1 py-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="h-4 w-4 accent-slate-900"
                />
                In stock
            </label>
            <input
                type="number"
                min="0"
                step="1"
                placeholder="Stock quantity"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="min-w-[120px] flex-1 border-b border-slate-200 bg-transparent px-1 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:focus:border-slate-400 dark:text-slate-200 dark:placeholder-slate-500"
            />
             <button
                type="button"
                onClick={() => document.getElementById("imageInput").click()}
                className="flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus:border-slate-400 dark:text-slate-200 dark:placeholder-slate-500"
            >
                <i className="fa-solid fa-image"></i>
                {image ? "Change Image" : "Upload Image"}
            </button>
            <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
            />

            <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus:border-slate-400 dark:text-slate-200 dark:placeholder-slate-500"
            >
                <FontAwesomeIcon icon={product ? faPen : faPlus} className="text-xs" />
                {product ? "Save Changes" : "Add Product"}
            </button>
            {product && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-white"
                >
                    Cancel
                </button>
            )}
        </form>
    );
}

export default ProductForm;