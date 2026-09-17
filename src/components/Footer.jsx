import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-500">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-14 sm:grid-cols-4">
                <div className="col-span-2 sm:col-span-1">
                    <Link
                        to="/"
                        
                        className="flex items-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl text-indigo-400 ">
                            <FontAwesomeIcon icon={faBagShopping} className="text-base" />
                        </span>
                        Shop<span className="text-indigo-400">ly</span>
                    </Link>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        Quality products, honest prices, delivered to your
                        door.
                    </p>
                </div>

                <div>
                    <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-900 dark:text-slate-200">
                        Shop
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                        <li>
                            <Link to="/products" className="text-slate-600 transition hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white">
                                All Products
                            </Link>
                        </li>
                        <li>
                            <Link to="/products" className="text-slate-600 transition hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white">
                                Electronics
                            </Link>
                        </li>
                        <li>
                            <Link to="/products" className="text-slate-600 transition hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white">
                                Kitchen
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-900 dark:text-slate-200">
                        Company
                    </h4>
                    <ul className="space-y-2.5 text-sm">
                        <li>
                            <Link to="/about" className="text-slate-600 transition hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-slate-600 transition hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-900 dark:text-slate-200">
                        Newsletter
                    </h4>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="w-full border-b border-slate-200 bg-transparent py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-400 dark:focus:border-slate-400 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:placeholder-slate-300"
                        />
                        <button className="shrink-0 text-sm font-medium text-slate-900 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                            Sign up
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400 dark:border-slate-500 dark:text-slate-300">
                © {new Date().getFullYear()} Shoply. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;