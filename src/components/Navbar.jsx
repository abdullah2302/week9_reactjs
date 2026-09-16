import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faBars, faXmark, faBagShopping, faUser, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const linkClass = ({ isActive }) =>
        `text-sm transition ${isActive
            ? "font-medium text-slate-900 dark:text-white"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`;

    const mobileLinkClass = ({ isActive }) =>
        `block py-2.5 text-base transition ${isActive
            ? "font-medium text-slate-900 dark:text-white"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`;

    function closeMenu() {
        setIsMenuOpen(false);
    }

    function handleLogout() {
        logout();
        closeMenu();
    }

    return (
        <header className="relative sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="flex items-center text-xl font-semibold tracking-tight text-slate-900 dark:text-white"
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

                    {/* Wishlist - Desktop only */}
                    <Link
                        to="/account/wishlist"
                        className="hidden items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:flex"
                    >
                        <FontAwesomeIcon icon={faHeart} />
                        <span>Wishlist</span>

                        {wishlistCount > 0 && (
                            <span className="ml-1 rounded-full bg-red-500 px-1.5 text-xs text-white">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        onClick={closeMenu}
                        className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <FontAwesomeIcon icon={faCartShopping} />

                        {cartCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <FontAwesomeIcon
                            icon={theme === "light" ? faMoon : faSun}
                            className="text-base"
                        />
                    </button>

                    {isAuthenticated ? (
                        <div className="ml-1 hidden items-center gap-3 sm:flex">
                            <Link
                                to="/account"
                                onClick={closeMenu}
                                className="flex items-center gap-1.5 text-sm text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                            >
                                <FontAwesomeIcon icon={faUser} className="text-xs" />
                                {user?.name}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="ml-1 hidden items-center gap-3 sm:flex">
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            >
                                Login
                            </Link>

                        </div>
                    )}

                    {/* Hamburger - Mobile */}
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden"
                    >
                        <FontAwesomeIcon
                            icon={isMenuOpen ? faXmark : faBars}
                            className="text-base"
                        />
                    </button>

                </div>
            </div>

            <nav
                className={`grid overflow-hidden border-slate-100 transition-all duration-200 ease-in-out dark:border-slate-800 sm:hidden ${isMenuOpen
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
                    <Link
                        to="/account/wishlist"
                        onClick={closeMenu}
                        className={mobileLinkClass}
                    >
                        <FontAwesomeIcon icon={faHeart} className="mr-2" />
                        Wishlist

                        {wishlistCount > 0 && (
                            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>
                    <NavLink to="/about" className={mobileLinkClass} onClick={closeMenu}>
                        About
                    </NavLink>
                    <NavLink to="/contact" className={mobileLinkClass} onClick={closeMenu}>
                        Contact
                    </NavLink>

                    <div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                        {isAuthenticated ? (
                            <>
                                <NavLink to="/account" className={mobileLinkClass} onClick={closeMenu}>
                                    {user?.name}'s Account
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full py-2.5 text-left text-base text-slate-500 dark:text-slate-400"
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