import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";
import { useRouter } from "next/navigation";

jest.mock("@/lib/actions/auth-action", () => ({
  handleRegister: jest.fn()
}));

const mockedActions = require("@/lib/actions/auth-action");

describe("RegisterForm", () => {
  test("shows mismatch error when passwords differ", async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByPlaceholderText(/Your Name/i), "Test User");
    await userEvent.type(screen.getByPlaceholderText(/name@gmail.com/i), "a@b.com");
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText(/•/);
    await userEvent.type(passwordInput, "abc123");
    await userEvent.type(confirmInput, "zzz");
    await userEvent.type(screen.getByPlaceholderText(/9800000000/), "9800000000");
    await userEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test("redirects to login on successful register", async () => {
    mockedActions.handleRegister.mockResolvedValue({ success: true, message: "ok" });
    render(<RegisterForm />);

    await userEvent.type(screen.getByPlaceholderText(/Your Name/i), "Test User");
    await userEvent.type(screen.getByPlaceholderText(/name@gmail.com/i), "a@b.com");
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText(/•/);
    await userEvent.type(passwordInput, "abc123");
    await userEvent.type(confirmInput, "abc123");
    await userEvent.type(screen.getByPlaceholderText(/9800000000/), "9800000000");
    await userEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/login");
    });
  });
});
