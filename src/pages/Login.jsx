import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const redirectTo = location.state?.from?.pathname || "/account";

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(email, password);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="mx-auto flex max-w-sm flex-col px-4 py-24">
            <h1 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-white">
                Sign in
            </h1>
            <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
                Sign in with your Shoply account.
            </p>

            {error && (
                <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-500 dark:bg-red-500/10 dark:text-red-400">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                    ref={inputRef}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-b border-slate-200 bg-transparent py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:text-white dark:placeholder-slate-500 dark:focus:border-white"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-b border-slate-200 bg-transparent py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:text-white dark:placeholder-slate-500 dark:focus:border-white"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                    {submitting ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-slate-900 underline dark:text-white">
                    Sign up
                </Link>
            </p>
        </main>
    );
}

export default Login;