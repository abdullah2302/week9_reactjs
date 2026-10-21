import { productsApi } from "../src/api/productsApi";
import axiosClient from "../src/api/axiosClient";

jest.mock("../src/api/axiosClient", () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

test("productsApi mocks the HTTP client and returns response data", async () => {
    axiosClient.get.mockResolvedValue({ data: { products: [] } });

    await expect(productsApi.getAll({ page: 1 })).resolves.toEqual({ products: [] });
    expect(axiosClient.get).toHaveBeenCalledWith("/products", {
        params: { page: 1 },
    });
});
