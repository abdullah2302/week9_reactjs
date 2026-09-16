import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function ProductForm({ onAddProduct }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);

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

        if (!name.trim() || !category.trim() || !price) {
            alert("Please fill all fields");
            return;
        }

        onAddProduct({
            name: name.trim(),
            description: description.trim(),
            category: category.trim(),
            price: Number(price),
            image: image,
        });

        setName("");
        setCategory("");
        setPrice("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-10 flex flex-wrap items-end gap-3 border-b border-slate-100 pb-8 dark:border-slate-700"
        >
            <div className="flex-1 basis-full">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-200">
                    Quick Add Product (demo)
                </p>
            </div>

            <input
                type="text"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-w-[140px] flex-1 border-b border-slate-200 bg-transparent px-1 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700"
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-w-[140px] flex-1 border-b border-slate-200 bg-transparent px-1 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700"
            />

            <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="min-w-[140px] flex-1 border-b border-slate-200 bg-transparent px-1 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700"
            />

            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="min-w-[100px] flex-1 border-b border-slate-200 bg-transparent px-1 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700"
            />
             <button
                type="button"
                onClick={() => document.getElementById("imageInput").click()}
                className="flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
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
                className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
                <FontAwesomeIcon icon={faPlus} className="text-xs" />
                Add Product
            </button>
        </form>
    );
}

export default ProductForm;