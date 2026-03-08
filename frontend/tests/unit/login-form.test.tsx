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

const getPasswordInput = () => document.querySelector<HTMLInputElement>('input[type="password"], input[type="text"]');

describe("LoginForm", () => {
  test("toggles password visibility and shows error on failed login", async () => {
    mockedActions.handleLogin.mockRejectedValue(new Error("Invalid credentials"));
    render(<LoginForm />);

    const passwordInput = getPasswordInput();
    expect(passwordInput).not.toBeNull();
    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: /Show/i }));
    expect(passwordInput).toHaveAttribute("type", "text");

    await userEvent.type(screen.getByPlaceholderText(/name@gmail.com/i), "a@b.com");
    await userEvent.type(passwordInput!, "secret");
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  test("redirects admin users to /admin after login", async () => {
    mockedActions.handleLogin.mockResolvedValue({
      success: true,
      data: { role: "admin" },
      message: "ok"
    });

    render(<LoginForm />);

    await userEvent.type(screen.getByPlaceholderText(/name@gmail.com/i), "a@b.com");
    const passwordInput = getPasswordInput();
    expect(passwordInput).not.toBeNull();
    await userEvent.type(passwordInput!, "secret");
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/admin");
    });
  });

  test("redirects normal users to homepage", async () => {
    mockedActions.handleLogin.mockResolvedValue({
      success: true,
      data: { role: "user" },
      message: "ok"
    });

    render(<LoginForm />);

    await userEvent.type(screen.getByPlaceholderText(/name@gmail.com/i), "user@example.com");
    const passwordInput = getPasswordInput();
    expect(passwordInput).not.toBeNull();
    await userEvent.type(passwordInput!, "secret");
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/homepage");
    });
  });
});
