import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [name, setName] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef(null);

    const inputHandler = () => {
        inputRef.current?.focus();
    };

  

    const redirectTo = location.state?.from?.pathname || "/products";

    function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) return;

        login(name.trim());
        navigate(redirectTo, { replace: true });
    }

    return (
        <main className="mx-auto flex max-w-sm flex-col px-4 py-24">
            <h1 className="mb-2 text-2xl font-semibold text-slate-900">
                Sign in
            </h1>
            <p className="mb-8 text-sm text-slate-500">
                This is a demo login — just enter any name to continue.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-b border-slate-200 bg-transparent py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
                />
                <button
                    type="submit"
                    onClick={inputHandler}
                    className="rounded-full bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                    Sign in
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-slate-900 underline">
                    Sign up
                </Link>
            </p>
        </main>
    );
}

export default Login;