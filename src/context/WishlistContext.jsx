import { createContext, useContext, useState, useEffect } from "react";
import { wishlistApi } from "../api/wishlistApi";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

function normalizeProduct(p) {
    return { ...p, id: p._id };
}

export function WishlistProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            setWishlistItems([]);
            return;
        }

        wishlistApi
            .get()
            .then((wl) =>
                setWishlistItems((wl.products || []).map(normalizeProduct))
            )
            .catch(() => setWishlistItems([]));
    }, [isAuthenticated]);

    async function addToWishlist(product) {
        const wl = await wishlistApi.add(product._id || product.id);
        setWishlistItems((wl.products || []).map(normalizeProduct));
    }

    async function removeFromWishlist(id) {
        const wl = await wishlistApi.remove(id);
        setWishlistItems((wl.products || []).map(normalizeProduct));
    }

    function isInWishlist(id) {
        return wishlistItems.some((item) => item.id === id);
    }

    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                wishlistCount,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}