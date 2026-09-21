import { createContext, useContext, useState, useEffect } from "react";
import { cartApi } from "../api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

// Normalizes a backend cart item ({ product: {...}, qty }) into the flat
// shape the rest of the UI already expects ({ id, name, price, qty, ... }).
function flattenItem(item) {
    return { ...item.product, id: item.product._id, qty: item.qty };
}

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    // Load the cart from the API whenever auth state changes — on login,
    // fetch the user's saved cart; on logout, clear it locally.
    useEffect(() => {
        if (!isAuthenticated) {
            setCartItems([]);
            return;
        }

        cartApi
            .get()
            .then((cart) => setCartItems((cart.items || []).map(flattenItem)))
            .catch(() => setCartItems([]));
    }, [isAuthenticated]);

    async function addToCart(product) {
        const cart = await cartApi.add(product._id || product.id, 1);
        setCartItems((cart.items || []).map(flattenItem));
    }

    async function removeFromCart(id) {
        const cart = await cartApi.remove(id);
        setCartItems((cart.items || []).map(flattenItem));
    }

    async function updateQty(id, qty) {
        if (qty < 1) return;
        const cart = await cartApi.updateQty(id, qty);
        setCartItems((cart.items || []).map(flattenItem));
    }

    async function clearCart() {
        const cart = await cartApi.clear();
        setCartItems((cart.items || []).map(flattenItem));
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