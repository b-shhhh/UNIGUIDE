import { render, screen } from "@testing-library/react";
import ProfilePageClient from "@/app/user/_components/ProfilePageClient";

jest.mock("@/lib/actions/auth-action", () => ({
  handleUpdateProfile: jest.fn(async () => ({ success: true, message: "ok" })),
  handleChangePassword: jest.fn(async () => ({ success: true, message: "ok" })),
  handleDeleteAccount: jest.fn(async () => ({ success: true, message: "ok" })),
  handleLogout: jest.fn()
}));

describe("ProfilePageClient", () => {
  test("shows user profile data", () => {
    render(
      <ProfilePageClient
        user={{
          fullName: "Jane Doe",
          email: "jane@example.com",
          phone: "123456789",
          bio: "Hello world",
          profilePic: "/uploads/pic.jpg"
        }}
      />
    );

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText(/123456789/)).toBeInTheDocument();
    expect(screen.getByAltText(/Profile image/i)).toHaveAttribute("src", expect.stringContaining("/uploads/pic.jpg"));
  });
});
