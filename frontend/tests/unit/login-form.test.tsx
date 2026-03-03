import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/app/(auth)/_components/LoginForm";
import { useRouter } from "next/navigation";

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ setUser: jest.fn() })
}));

jest.mock("@/lib/actions/auth-action", () => ({
  handleLogin: jest.fn()
}));

const mockedActions = require("@/lib/actions/auth-action");

describe("LoginForm", () => {
  test("redirects admin users to /admin after login", async () => {
    mockedActions.handleLogin.mockResolvedValue({
      success: true,
      data: { role: "admin" },
      message: "ok"
    });

    render(<LoginForm />);

    await userEvent.type(screen.getByPlaceholderText(/name@gmail.com/i), "a@b.com");
    const passwordInput = screen.getByPlaceholderText(/•/);
    await userEvent.type(passwordInput, "secret");
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/admin");
    });
  });
});
