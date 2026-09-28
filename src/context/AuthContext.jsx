import { createContext, useContext, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { queryKeys } from "../lib/queryKeys";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const queryClient = useQueryClient();
    const hasToken = Boolean(localStorage.getItem("token"));
    const { data, isPending, isError } = useQuery({
        queryKey: queryKeys.auth.me,
        queryFn: authApi.getMe,
        enabled: hasToken,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const user = data?.user || null;

    useEffect(() => {
        if (isError) localStorage.removeItem("token");
    }, [isError]);

    const authMutation = useMutation({
        mutationFn: ({ action, name, email, password }) =>
            action === "signup"
                ? authApi.signup(name, email, password)
                : authApi.login(email, password),
        onSuccess: (result) => {
            localStorage.setItem("token", result.token);
            queryClient.setQueryData(queryKeys.auth.me, { user: result.user });
        },
    });

    async function signup(name, email, password) {
        try {
            await authMutation.mutateAsync({ action: "signup", name, email, password });
        } catch (error) {
            throw new Error(error.response?.data?.message || "Unable to create account");
        }
    }

    async function login(email, password) {
        try {
            await authMutation.mutateAsync({ action: "login", email, password });
        } catch (error) {
            throw new Error(error.response?.data?.message || "Invalid email or password");
        }
    }

    function logout() {
        localStorage.removeItem("token");
        queryClient.removeQueries({ queryKey: ["auth"] });
    }

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider
            value={{ user, loading: hasToken && isPending, signup, login, logout, isAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}