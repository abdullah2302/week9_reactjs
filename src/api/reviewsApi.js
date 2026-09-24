import axiosClient from "./axiosClient";

export const reviewsApi = {
    create: async (review) => (await axiosClient.post("/reviews", review)).data,
    getProductReviews: async (productId) =>
        (await axiosClient.get(`/reviews/product/${productId}`)).data,
    getMyReviews: async () => (await axiosClient.get("/reviews/my-reviews")).data,
};
