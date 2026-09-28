import { createContext, useContext, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "../api/wishlistApi";
import { useAuth } from "./AuthContext";
import { queryKeys } from "../lib/queryKeys";

const WishlistContext = createContext(null);

function normalizeProduct(p) {
    return { ...p, id: p._id };
}

export function WishlistProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: queryKeys.wishlist,
        queryFn: wishlistApi.get,
        enabled: isAuthenticated,
    });
    const wishlistItems = isAuthenticated
        ? (data?.products || []).map(normalizeProduct)
        : [];

    useEffect(() => {
        if (!isAuthenticated) queryClient.removeQueries({ queryKey: queryKeys.wishlist });
    }, [isAuthenticated, queryClient]);

    const addMutation = useMutation({
        mutationFn: (product) => wishlistApi.add(product._id || product.id),
        onSuccess: (wishlist) => queryClient.setQueryData(queryKeys.wishlist, wishlist),
    });
    const removeMutation = useMutation({
        mutationFn: wishlistApi.remove,
        onSuccess: (wishlist) => queryClient.setQueryData(queryKeys.wishlist, wishlist),
    });

    async function addToWishlist(product) {
        return addMutation.mutateAsync(product);
    }

    async function removeFromWishlist(id) {
        return removeMutation.mutateAsync(id);
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