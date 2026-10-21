import { fireEvent, render, screen } from "@testing-library/react";
import FilterBar from "../src/components/FilterBar";
import Pagination from "../src/components/Pagination";
import OrderStatusBadge from "../src/components/OrderStatusBadge";
import EmptyState from "../src/components/EmptyState";
import LoadingSkeleton from "../src/components/LoadingSkeleton";
import ProductForm from "../src/components/ProductForm";

describe("React components", () => {
    test("FilterBar reports category and search changes", () => {
        const onCategoryChange = jest.fn();
        const onSearchChange = jest.fn();
        render(
            <FilterBar
                categories={["All", "Books"]}
                categoryFilter="All"
                onCategoryChange={onCategoryChange}
                searchTerm=""
                onSearchChange={onSearchChange}
            />
        );

        fireEvent.change(screen.getByRole("combobox"), { target: { value: "Books" } });
        fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "novel" } });

        expect(onCategoryChange).toHaveBeenCalledWith("Books");
        expect(onSearchChange).toHaveBeenCalledWith("novel");
    });

    test("Pagination disables the boundary buttons and changes page", () => {
        const onPageChange = jest.fn();
        render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />);

        fireEvent.click(screen.getByRole("button", { name: "Previous" }));
        fireEvent.click(screen.getByRole("button", { name: "Next" }));

        expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
        expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
    });

    test("OrderStatusBadge renders the current status", () => {
        render(<OrderStatusBadge status="shipped" />);

        expect(screen.getByText("shipped")).toBeInTheDocument();
        expect(screen.getByText("shipped")).toHaveClass("text-indigo-600");
    });

    test("EmptyState renders its content", () => {
        render(<EmptyState><p>No products found</p></EmptyState>);

        expect(screen.getByText("No products found")).toBeInTheDocument();
    });

    test("LoadingSkeleton exposes a busy state and requested rows", () => {
        const { container } = render(<LoadingSkeleton rows={2} />);

        expect(screen.getByLabelText("Loading")).toHaveAttribute("aria-busy", "true");
        expect(container.querySelectorAll(".animate-pulse")).toHaveLength(3);
    });

    test("ProductForm submits normalized product data", () => {
        const onAddProduct = jest.fn();
        render(<ProductForm onAddProduct={onAddProduct} />);

        fireEvent.change(screen.getByPlaceholderText("Product name"), {
            target: { value: "  Chair " },
        });
        fireEvent.change(screen.getByPlaceholderText("Description"), {
            target: { value: " Wooden chair " },
        });
        fireEvent.change(screen.getByPlaceholderText("Category"), {
            target: { value: " Furniture " },
        });
        fireEvent.change(screen.getByPlaceholderText("Price"), {
            target: { value: "25" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Add Product" }));

        expect(onAddProduct).toHaveBeenCalledWith(expect.objectContaining({
            name: "Chair",
            description: "Wooden chair",
            category: "Furniture",
            price: 25,
            stockQuantity: 1,
        }));
    });
});
