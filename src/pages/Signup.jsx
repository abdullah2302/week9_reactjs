import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
    const [name, setName] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef(null);

    

    const redirectTo = location.state?.from?.pathname || "/account";
    const inputHadnler = (e) => {
      inputRef.current?.focus();
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) return;

        // Demo only: signup and login do the same thing here (no real
        // backend/accounts) — this just creates the session.
        login(name.trim());
        navigate(redirectTo, { replace: true });
    }

    return (
        <main className="mx-auto flex max-w-sm flex-col px-4 py-24">
            <h1 className="mb-2 text-2xl font-semibold text-slate-900">
                Create an account
            </h1>
            <p className="mb-8 text-sm text-slate-500">
                This is a demo signup — just enter any name to continue.
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
                    onClick={inputHadnler}
                    className="rounded-full bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                    Sign up
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-slate-900 underline">
                    Sign in
                </Link>
            </p>
        </main>
    );
}

export default Signup;