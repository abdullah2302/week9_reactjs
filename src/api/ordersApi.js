import axiosClient from "./axiosClient";

export const ordersApi = {
    create: async (orderData) => {
        const response = await axiosClient.post(
            "/orders",
            orderData
        );

        return response.data;
    },

    getMyOrders: async (params) => {
        const response = await axiosClient.get("/orders/my", { params });

        return response.data;
    },

    getAllOrders: async (params) => {
        const response = await axiosClient.get("/orders/all", { params });

        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await axiosClient.patch(
            `/orders/${id}/status`,
            { status }
        );

        return response.data;
    },
};