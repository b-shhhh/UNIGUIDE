import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordForm from "@/app/(auth)/_components/ForgetPasswordForm";

jest.mock("@/lib/actions/auth-action", () => ({
  handleRequestPasswordReset: jest.fn()
}));

const mockedActions = require("@/lib/actions/auth-action");

describe("ForgotPasswordForm", () => {
  test("shows success message when request succeeds", async () => {
    mockedActions.handleRequestPasswordReset.mockResolvedValue({ success: true, message: "sent" });
    render(<ForgotPasswordForm />);

    await userEvent.type(screen.getByPlaceholderText(/example@gmail.com/i), "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: /Send Reset Link/i }));

    await waitFor(() => {
      expect(screen.getByText(/sent/i)).toBeInTheDocument();
    });
  });
});
