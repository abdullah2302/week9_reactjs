import { createContext, useContext, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);

    function addToWishlist(product) {
        setWishlistItems((prev) => {
            const alreadyIn = prev.some((item) => item.id === product.id);
            if (alreadyIn) return prev;
            return [...prev, product];
        });
    }

    function removeFromWishlist(id) {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    }

    function isInWishlist(id) {
        return wishlistItems.some((item) => item.id === id);
    }

    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider
            value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}