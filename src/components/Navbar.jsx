import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faBars, faXmark, faBagShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const linkClass = ({ isActive }) =>
        `text-sm transition ${
            isActive
                ? "font-medium text-slate-900"
                : "text-slate-500 hover:text-slate-900"
        }`;

    const mobileLinkClass = ({ isActive }) =>
        `block py-2.5 text-base transition ${
            isActive ? "font-medium text-slate-900" : "text-slate-500"
        }`;

    function closeMenu() {
        setIsMenuOpen(false);
    }

    function handleLogout() {
        logout();
        closeMenu();
    }

    return (
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="flex items-center text-xl font-semibold tracking-tight text-slate-900"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl text-indigo-400 ">
                        <FontAwesomeIcon icon={faBagShopping} className="text-base" />
                    </span>
                    Shop<span className="text-indigo-400">ly</span>
                </Link>

                <nav className="hidden gap-8 sm:flex">
                    <NavLink to="/" className={linkClass} end>
                        Home
                    </NavLink>
                    <NavLink to="/products" className={linkClass}>
                        Products
                    </NavLink>
                    <NavLink to="/about" className={linkClass}>
                        About
                    </NavLink>
                    <NavLink to="/contact" className={linkClass}>
                        Contact
                    </NavLink>
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        to="/account/wishlist"
                        onClick={closeMenu}
                        className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
                    >
                        <FontAwesomeIcon icon={faHeart} className="text-base" />

                        {wishlistCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/cart"
                        onClick={closeMenu}
                        className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
                    >
                        <FontAwesomeIcon icon={faCartShopping} className="text-base" />

                        {cartCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth area: greeting + logout when signed in,
                        Login/Sign Up links otherwise */}
                    {isAuthenticated ? (
                        <div className="ml-1 hidden items-center gap-3 sm:flex">
                            <Link
                                to="/account"
                                onClick={closeMenu}
                                className="flex items-center gap-1.5 text-sm text-slate-700 transition hover:text-slate-900"
                            >
                                <FontAwesomeIcon icon={faUser} className="text-xs" />
                                {user?.name}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-slate-500 transition hover:text-slate-900"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="ml-1 hidden items-center gap-3 sm:flex">
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="text-sm text-slate-500 transition hover:text-slate-900"
                            >
                                Login
                            </Link>
                        </div>
                    )}

                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 sm:hidden"
                    >
                        <FontAwesomeIcon
                            icon={isMenuOpen ? faXmark : faBars}
                            className="text-base"
                        />
                    </button>
                </div>
            </div>

            <nav
                className={`grid overflow-hidden border-slate-100 transition-all duration-200 ease-in-out sm:hidden ${
                    isMenuOpen
                        ? "grid-rows-[1fr] border-t opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden px-4 py-1">
                    <NavLink to="/" className={mobileLinkClass} onClick={closeMenu} end>
                        Home
                    </NavLink>
                    <NavLink to="/products" className={mobileLinkClass} onClick={closeMenu}>
                        Products
                    </NavLink>
                    <NavLink to="/about" className={mobileLinkClass} onClick={closeMenu}>
                        About
                    </NavLink>
                    <NavLink to="/contact" className={mobileLinkClass} onClick={closeMenu}>
                        Contact
                    </NavLink>

                    <div className="mt-2 border-t border-slate-100 pt-2">
                        {isAuthenticated ? (
                            <>
                                <NavLink to="/account" className={mobileLinkClass} onClick={closeMenu}>
                                    {user?.name}'s Account
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full py-2.5 text-left text-base text-slate-500"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className={mobileLinkClass} onClick={closeMenu}>
                                    Login
                                </NavLink>
                                <NavLink to="/signup" className={mobileLinkClass} onClick={closeMenu}>
                                    Sign Up
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;