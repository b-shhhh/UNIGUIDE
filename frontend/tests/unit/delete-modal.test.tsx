import { render, screen } from "@testing-library/react";
import DeleteModal from "@/app/(public)/_components/DeleteModal";

describe("DeleteModal", () => {
  test("renders confirm and cancel actions", () => {
    render(<DeleteModal />);
    expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
  });
});
