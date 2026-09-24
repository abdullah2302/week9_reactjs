import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { reviewsApi } from "../api/reviewsApi";

function ReviewModal({ orderId, product, onClose, onSubmitted }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            await reviewsApi.create({
                orderId,
                productId: product._id || product.id,
                rating,
                comment,
            });
            onSubmitted();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to submit review");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
                        <div>
                            <h2 className="font-semibold text-slate-900 dark:text-white">Review Product</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{product.name}</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close review form" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className="mb-5">
                    <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Your rating</p>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} stars`} className={`text-2xl transition ${value <= rating ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}>
                                <FontAwesomeIcon icon={faStar} />
                            </button>
                        ))}
                    </div>
                </div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Review
                    <textarea value={comment} onChange={(event) => setComment(event.target.value)} required maxLength={2000} rows={5} placeholder="Share your experience..." className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-transparent p-3 text-sm outline-none focus:border-slate-500 dark:border-slate-700 dark:text-white" />
                </label>
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                <button disabled={submitting} className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900">
                    {submitting ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </div>
    );
}

export default ReviewModal;
