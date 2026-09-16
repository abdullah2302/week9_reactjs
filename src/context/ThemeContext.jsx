import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "theme";

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored === "light" || stored === "dark" ? stored : "light";
        } catch {
            return "light";
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // localStorage might be unavailable
        }
    }, [theme]);

    function toggleTheme() {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}