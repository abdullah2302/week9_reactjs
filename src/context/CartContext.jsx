import { createContext, useContext, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../api/cartApi";
import { useAuth } from "./AuthContext";
import { queryKeys } from "../lib/queryKeys";

const CartContext = createContext(null);

// Normalizes a backend cart item ({ product: {...}, qty }) into the flat
// shape the rest of the UI already expects ({ id, name, price, qty, ... }).
function flattenItem(item) {
    return { ...item.product, id: item.product._id, qty: item.qty };
}

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const quantityRequests = useRef(new Map());
    const { data } = useQuery({
        queryKey: queryKeys.cart,
        queryFn: cartApi.get,
        enabled: isAuthenticated,
    });
    const cartItems = isAuthenticated
        ? (data?.items || []).map(flattenItem)
        : [];

    useEffect(() => {
        if (!isAuthenticated) queryClient.removeQueries({ queryKey: queryKeys.cart });
    }, [isAuthenticated, queryClient]);

    const addMutation = useMutation({
        mutationFn: (product) => cartApi.add(product._id || product.id, 1),
        onSuccess: (cart) => queryClient.setQueryData(queryKeys.cart, cart),
    });
    const removeMutation = useMutation({
        mutationFn: cartApi.remove,
        onSuccess: (cart) => queryClient.setQueryData(queryKeys.cart, cart),
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, qty }) => cartApi.updateQty(id, qty),
        onMutate: async ({ id, qty }) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.cart });
            const previousCart = queryClient.getQueryData(queryKeys.cart);
            queryClient.setQueryData(queryKeys.cart, (current) =>
                current
                    ? {
                        ...current,
                        items: qty === 0
                            ? current.items.filter((item) => item.product?._id !== id)
                            : current.items.map((item) =>
                                item.product?._id === id ? { ...item, qty } : item
                            ),
                    }
                    : current
            );
            return { previousCart };
        },
        onSuccess: (cart) => queryClient.setQueryData(queryKeys.cart, cart),
        onError: (_error, _variables, context) => {
            queryClient.setQueryData(queryKeys.cart, context?.previousCart);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart }),
    });
    const clearMutation = useMutation({
        mutationFn: cartApi.clear,
        onSuccess: (cart) => queryClient.setQueryData(queryKeys.cart, cart),
    });

    async function addToCart(product) {
        return addMutation.mutateAsync(product);
    }

    async function removeFromCart(id) {
        return removeMutation.mutateAsync(id);
    }

    async function updateQty(id, qty) {
        if (qty < 0) return;

        const previousRequest = quantityRequests.current.get(id) || Promise.resolve();
        const request = previousRequest
            .catch(() => undefined)
            .then(() => updateMutation.mutateAsync({ id, qty }));
        quantityRequests.current.set(id, request);
        await request;

        if (quantityRequests.current.get(id) === request) {
            quantityRequests.current.delete(id);
        }
    }

    async function clearCart() {
        return clearMutation.mutateAsync();
    }

    const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.qty * item.price,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQty,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}