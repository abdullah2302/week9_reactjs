import axiosClient from "./axiosClient";

export const wishlistApi = {
    get: async () => (await axiosClient.get("/wishlist")).data,
    add: async (productId) =>
        (await axiosClient.post("/wishlist", { productId })).data,
    remove: async (productId) =>
        (await axiosClient.delete(`/wishlist/${productId}`)).data,
};