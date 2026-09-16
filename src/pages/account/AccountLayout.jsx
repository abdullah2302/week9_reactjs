import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


function AccountLayout() {
    const { user, logout } = useAuth();

    const tabClass = ({ isActive }) =>
        `pb-2 text-sm transition ${
            isActive
                ? "border-b-2 border-slate-900 font-medium text-slate-900"
                : "text-slate-500 hover:text-slate-900"
        }`;

    return (
        <main className="mx-auto max-w-5xl px-4 py-14">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Hi, {user?.name}
                </h1>
                <button
                    onClick={logout}
                    className="text-sm text-slate-500 transition hover:text-slate-900"
                >
                    Sign out
                </button>
            </div>

            <nav className="mb-8 flex gap-6 border-b border-slate-100">
                <NavLink to="/account/wishlist" className={tabClass}>
                    Wishlist
                </NavLink>
                
            </nav>

          
            <Outlet />
        </main>
    );
}

export default AccountLayout;