export const queryKeys = {
    auth: {
        me: ["auth", "me"],
    },
    products: {
        all: ["products"],
        list: (params) => ["products", params],
        detail: (id) => ["products", "detail", id],
    },
    reviews: {
        product: (productId) => ["reviews", "product", productId],
        mine: ["reviews", "mine"],
    },
    orders: {
        mine: (params) => ["orders", "mine", params],
        all: (params) => ["orders", "all", params],
    },
    cart: ["cart"],
    wishlist: ["wishlist"],
    notifications: ["notifications"],
    chat: {
        messages: (customerId = "all") => ["chat", "messages", customerId],
        conversations: ["chat", "conversations"],
    },
};
