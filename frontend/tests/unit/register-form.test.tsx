import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";
import { useRouter } from "next/navigation";

jest.mock("@/lib/actions/auth-action", () => ({
  handleRegister: jest.fn()
}));

const mockedActions = require("@/lib/actions/auth-action");

const getPasswordInput = () => document.querySelector<HTMLInputElement>('input[name="password"]');
const getConfirmPasswordInput = () => document.querySelector<HTMLInputElement>('input[name="confirmPassword"]');

describe("RegisterForm", () => {
  test("toggles password visibility", async () => {
    render(<RegisterForm />);

    const passwordInput = getPasswordInput();
    expect(passwordInput).not.toBeNull();
    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(screen.getAllByRole("button", { name: /Show/i })[0]);
    expect(passwordInput).toHaveAttribute("type", "text");

    await userEvent.click(screen.getAllByRole("button", { name: /Hide/i })[0]);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("shows mismatch error when passwords differ", async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByPlaceholderText(/Your Name/i), "Test User");
    await userEvent.type(screen.getByPlaceholderText(/name@gmail.com/i), "a@b.com");
    const passwordInput = getPasswordInput();
    const confirmInput = getConfirmPasswordInput();
    expect(passwordInput).not.toBeNull();
    expect(confirmInput).not.toBeNull();
    await userEvent.type(passwordInput!, "abc123");
    await userEvent.type(confirmInput!, "zzz");
    await userEvent.type(screen.getByPlaceholderText(/9800000000/), "9800000000");
    await userEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test("shows server error when registration fails", async () => {
    mockedActions.handleRegister.mockResolvedValue({ success: false, message: "Email already exists" });
    render(<RegisterForm />);

    await userEvent.type(screen.getByPlaceholderText(/Your Name/i), "Test User");
    await userEvent.type(screen.getByPlaceholderText(/name@gmail.com/i), "a@b.com");
    const passwordInput = getPasswordInput();
    const confirmInput = getConfirmPasswordInput();
    expect(passwordInput).not.toBeNull();
    expect(confirmInput).not.toBeNull();
    await userEvent.type(passwordInput!, "abc123");
    await userEvent.type(confirmInput!, "abc123");
    await userEvent.type(screen.getByPlaceholderText(/9800000000/), "9800000000");
    await userEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(await screen.findByText(/Email already exists/i)).toBeInTheDocument();
  });

  test("redirects to login on successful register", async () => {
    mockedActions.handleRegister.mockResolvedValue({ success: true, message: "ok" });
    render(<RegisterForm />);

    await userEvent.type(screen.getByPlaceholderText(/Your Name/i), "Test User");
    await userEvent.type(screen.getByPlaceholderText(/name@gmail.com/i), "a@b.com");
    const passwordInput = getPasswordInput();
    const confirmInput = getConfirmPasswordInput();
    expect(passwordInput).not.toBeNull();
    expect(confirmInput).not.toBeNull();
    await userEvent.type(passwordInput!, "abc123");
    await userEvent.type(confirmInput!, "abc123");
    await userEvent.type(screen.getByPlaceholderText(/9800000000/), "9800000000");
    await userEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/login");
    });
  });
});
