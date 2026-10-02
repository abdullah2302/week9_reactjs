
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import LoadingSkeleton from "./components/LoadingSkeleton";

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Checkout = lazy(() => import("./pages/Checkout"));

const AccountLayout = lazy(() => import("./pages/account/AccountLayout"));
const Orders = lazy(() => import("./pages/account/Orders"));

const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));

const NotFound = lazy(() => import("./pages/NotFound"));

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <>
            <div className="flex min-h-screen flex-col bg-white dark:bg-slate-900">
                <Navbar />

                <div className="flex-1">
                    <Suspense
                        fallback={<LoadingSkeleton rows={4} />}
                    >
                        <Routes>
                        {/* PUBLIC ROUTES */}

                        <Route path="/" element={<Home />} />

                        <Route
                            path="/products"
                            element={<Products />}
                        />

                        <Route
                            path="/products/:id"
                            element={<ProductDetail />}
                        />

                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute customerOnly>
                                    <Cart />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/about"
                            element={<About />}
                        />

                        <Route
                            path="/contact"
                            element={<Contact />}
                        />

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/signup"
                            element={<Signup />}
                        />

                        {/*  PROTECTED CHECKOUT */}

                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute customerOnly>
                                    <Checkout />
                                </ProtectedRoute>
                            }
                        />

                        {/*  USER ACCOUNT  */}

                        <Route
                            path="/account"
                            element={
                                <ProtectedRoute customerOnly>
                                    <AccountLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                index
                                element={<Wishlist />}
                            />

                            <Route
                                path="wishlist"
                                element={<Wishlist />}
                            />

                            <Route
                                path="orders"
                                element={<Orders />}
                            />
                        </Route>

                        {/*  ADMIN ROUTES */}

                        <Route
                            path="/admin/products"
                            element={
                                <AdminRoute>
                                    <AdminProducts />
                                </AdminRoute>
                            }
                        />

                        <Route
                            path="/admin/orders"
                            element={
                                <AdminRoute>
                                    <AdminOrders />
                                </AdminRoute>
                            }
                        />

                        {/* 404  */}

                        <Route
                            path="*"
                            element={<NotFound />}
                        />
                        </Routes>
                    </Suspense>
                </div>

                <Footer />
                <ChatWidget />
            </div>

            <ToastContainer />
        </>
    );
}

export default App;

