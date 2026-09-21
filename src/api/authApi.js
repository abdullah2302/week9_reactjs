import axiosClient from "./axiosClient";

export const authApi = {
    signup: async (name, email, password) =>
        (await axiosClient.post("/auth/signup", { name, email, password })).data,
    login: async (email, password) =>
        (await axiosClient.post("/auth/login", { email, password })).data,
    getMe: async () => (await axiosClient.get("/auth/me")).data,
};