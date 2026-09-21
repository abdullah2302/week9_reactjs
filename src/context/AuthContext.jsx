import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On first load, if a token is saved from a previous session, verify
    // it against the API and restore the user — otherwise the app would
    // "forget" a logged-in user on every page refresh.
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        authApi
            .getMe()
            .then((data) => setUser(data.user))
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    async function signup(name, email, password) {
        const data = await authApi.signup(name, email, password);
        localStorage.setItem("token", data.token);
        setUser(data.user);
    }

    async function login(email, password) {
        const data = await authApi.login(email, password);
        localStorage.setItem("token", data.token);
        setUser(data.user);
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider
            value={{ user, loading, signup, login, logout, isAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}