import axiosClient from "./axiosClient";

export const notificationsApi = {
    getAll: async () => (await axiosClient.get("/notifications")).data,
    markRead: async (id) =>
        (await axiosClient.patch(`/notifications/${id}/read`)).data,
};
