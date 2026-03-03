import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordForm from "@/app/(auth)/_components/ResetPasswordForm";
import { useSearchParams, useRouter } from "next/navigation";

jest.mock("@/lib/actions/auth-action", () => ({
  handleResetPassword: jest.fn()
}));

const mockedActions = require("@/lib/actions/auth-action");

describe("ResetPasswordForm", () => {
  test("requires matching passwords and redirects on success", async () => {
    const params = useSearchParams();
    params.set("token", "abc123");
    const router = useRouter();
    mockedActions.handleResetPassword.mockResolvedValue({ success: true, message: "ok" });

    render(<ResetPasswordForm />);

    await userEvent.type(screen.getAllByPlaceholderText("********")[0], "newpass");
    await userEvent.type(screen.getAllByPlaceholderText("********")[1], "newpass");
    await userEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => {
      expect(mockedActions.handleResetPassword).toHaveBeenCalledWith("abc123", "newpass");
    });

    expect(await screen.findByText(/ok/i)).toBeInTheDocument();
  });
});
