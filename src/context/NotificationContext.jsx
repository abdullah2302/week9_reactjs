import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { notificationsApi } from "../api/notificationsApi";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            return undefined;
        }

        let active = true;

        const loadNotifications = async () => {
            try {
                const data = await notificationsApi.getAll();
                if (active) setNotifications(data);
            } catch {
                if (active) setNotifications([]);
            }
        };

        loadNotifications();

        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL;
        const socketUrl = apiUrl
            ? new URL(apiUrl, window.location.origin).origin
            : window.location.origin;
        const socket = io(socketUrl, { auth: { token } });

        socket.on("connect", loadNotifications);
        socket.on("notification:new", (notification) => {
            setNotifications((current) => [
                notification,
                ...current.filter((item) => item._id !== notification._id),
            ].slice(0, 30));
        });

        return () => {
            active = false;
            socket.disconnect();
        };
    }, [isAuthenticated]);

    async function markRead(id) {
        await notificationsApi.markRead(id);
        setNotifications((current) =>
            current.map((notification) =>
                notification._id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    }

    async function markAllRead() {
        await notificationsApi.markAllRead();
        setNotifications((current) =>
            current.map((notification) => ({ ...notification, read: true }))
        );
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
