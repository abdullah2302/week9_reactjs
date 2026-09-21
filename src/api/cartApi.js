import axiosClient from "./axiosClient";

export const cartApi = {
    get: async () => (await axiosClient.get("/cart")).data,
    add: async (productId, qty = 1) =>
        (await axiosClient.post("/cart", { productId, qty })).data,
    updateQty: async (productId, qty) =>
        (await axiosClient.put(`/cart/${productId}`, { qty })).data,
    remove: async (productId) =>
        (await axiosClient.delete(`/cart/${productId}`)).data,
    clear: async () => (await axiosClient.delete("/cart")).data,
};