
import { Link } from "react-router-dom";

function AdminDashboard() {
    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-14">
            <h1 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-white">
                Admin Dashboard
            </h1>

            <div className="grid gap-6 sm:grid-cols-2">
                <Link
                    to="/admin/products"
                    className="rounded-xl border border-slate-200 bg-white p-6 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Manage Products
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Add and delete products.
                    </p>
                </Link>

                <Link
                    to="/admin/orders"
                    className="rounded-xl border border-slate-200 bg-white p-6 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Manage Orders
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        View and manage customer orders.
                    </p>
                </Link>
            </div>
        </main>
    );
}

export default AdminDashboard;

