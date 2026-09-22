
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";

import AccountLayout from "./pages/account/AccountLayout";
import Orders from "./pages/account/Orders";

import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

import NotFound from "./pages/NotFound";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <>
            <div className="flex min-h-screen flex-col bg-white dark:bg-slate-900">
                <Navbar />

                <div className="flex-1">
                    <Routes>
                        {/* ================= PUBLIC ROUTES ================= */}

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
                                <ProtectedRoute>
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

                        {/* ================= PROTECTED CHECKOUT ================= */}

                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute customerOnly>
                                    <Checkout />
                                </ProtectedRoute>
                            }
                        />

                        {/* ================= USER ACCOUNT ================= */}

                        <Route
                            path="/account"
                            element={
                                <ProtectedRoute>
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

                        {/* ================= ADMIN ROUTES ================= */}

                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />

                        {/* <Route
                            path="/admin/products"
                            element={
                                <AdminRoute>
                                    <AdminProducts />
                                </AdminRoute>
                            }
                        /> */}

                        <Route
                            path="/admin/orders"
                            element={
                                <AdminRoute>
                                    <AdminOrders />
                                </AdminRoute>
                            }
                        />

                        {/* ================= 404 ================= */}

                        <Route
                            path="*"
                            element={<NotFound />}
                        />
                    </Routes>
                </div>

                <Footer />
            </div>

            <ToastContainer />
        </>
    );
}

export default App;

