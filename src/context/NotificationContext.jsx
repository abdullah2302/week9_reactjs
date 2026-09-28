import { createContext, useContext, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { notificationsApi } from "../api/notificationsApi";
import { useAuth } from "./AuthContext";
import { queryKeys } from "../lib/queryKeys";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const { data: notifications = [] } = useQuery({
        queryKey: queryKeys.notifications,
        queryFn: notificationsApi.getAll,
        enabled: isAuthenticated,
        staleTime: 30 * 1000,
    });

    useEffect(() => {
        if (!isAuthenticated) {
            queryClient.removeQueries({ queryKey: queryKeys.notifications });
            return undefined;
        }

        const token = localStorage.getItem("token");
        const apiUrl =
            import.meta.env.VITE_API_URL ||
            (window.location.hostname.endsWith("vercel.app")
                ? "https://wee9-backend.onrender.com/api"
                : "http://localhost:5000/api");
        const socketUrl = apiUrl
            ? new URL(apiUrl, window.location.origin).origin
            : window.location.origin;
        const socket = io(socketUrl, { auth: { token } });

        socket.on("connect", () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }));
        socket.on("notification:new", (notification) => {
            if (!notification?._id) return;
            queryClient.setQueryData(queryKeys.notifications, (current = []) => [
                notification,
                ...current.filter((item) => item._id !== notification._id),
            ].slice(0, 30));
        });

        return () => {
            socket.disconnect();
        };
    }, [isAuthenticated, queryClient]);

    const markReadMutation = useMutation({
        mutationFn: notificationsApi.markRead,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
            const previous = queryClient.getQueryData(queryKeys.notifications);
            queryClient.setQueryData(queryKeys.notifications, (current = []) =>
                current.map((notification) => notification._id === id
                    ? { ...notification, read: true }
                    : notification)
            );
            return { previous };
        },
        onError: (_error, _id, context) => queryClient.setQueryData(queryKeys.notifications, context?.previous),
        onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
    });
    const markAllReadMutation = useMutation({
        mutationFn: notificationsApi.markAllRead,
        onSuccess: () => queryClient.setQueryData(queryKeys.notifications, (current = []) =>
            current.map((notification) => ({ ...notification, read: true }))
        ),
    });

    function markRead(id) {
        return markReadMutation.mutateAsync(id);
    }

    function markAllRead() {
        return markAllReadMutation.mutateAsync();
    }

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    return (
        <NotificationContext.Provider
            value={{ notifications, unreadCount, markRead, markAllRead }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}
