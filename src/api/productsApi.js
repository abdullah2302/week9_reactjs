import axiosClient from "./axiosClient";

export const productsApi = {
    getAll: async (params, config = {}) =>
        (await axiosClient.get("/products", { params, ...config })).data,
    getById: async (id) => (await axiosClient.get(`/products/${id}`)).data,
    create: async (product) => (await axiosClient.post("/products", product)).data,
    remove: async (id) => (await axiosClient.delete(`/products/${id}`)).data,
};