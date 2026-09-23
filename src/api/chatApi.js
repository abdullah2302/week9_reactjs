import axiosClient from "./axiosClient";

export const chatApi = {
    getMessages: async (customerId) =>
        (await axiosClient.get("/chat/messages", { params: customerId ? { customerId } : {} })).data,
    getConversations: async () => (await axiosClient.get("/chat/conversations")).data,
    markRead: async (customerId = "all") => (await axiosClient.patch(`/chat/read/${customerId}`)).data,
};