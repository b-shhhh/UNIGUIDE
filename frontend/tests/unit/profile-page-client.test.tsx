import { render, screen } from "@testing-library/react";
import ProfilePageClient, {
  asString,
  changePasswordAction,
  deleteAccountAction,
  getAvatar,
  getAvatarUrl,
  getUserBio,
  getUserDisplayName,
  getUserEmail,
  getUserPhone,
  updateProfileAction
} from "@/app/user/_components/ProfilePageClient";

jest.mock("@/lib/actions/auth-action", () => ({
  handleUpdateProfile: jest.fn(async () => ({ success: true, message: "ok" })),
  handleChangePassword: jest.fn(async () => ({ success: true, message: "ok" })),
  handleDeleteAccount: jest.fn(async () => ({ success: true, message: "ok" })),
  handleLogout: jest.fn()
}));

const mockedActions = require("@/lib/actions/auth-action");

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

  test("renders fallback values when user fields are missing", () => {
    render(<ProfilePageClient user={{ username: 42, avatar: "avatars\\me.png" }} />);

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("No email available")).toBeInTheDocument();
    expect(screen.getByText("Phone: Not set")).toBeInTheDocument();
    expect(screen.getByAltText(/Profile image/i)).toHaveAttribute("src", "http://127.0.0.1:5050/avatars/me.png");
  });

  test("shows no-photo state and cancels account deletion when confirm returns false", () => {
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);
    render(<ProfilePageClient user={null} />);

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("No Photo")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: /Delete Account/i });
    const form = deleteButton.closest("form");
    expect(form).not.toBeNull();

    const event = new Event("submit", { bubbles: true, cancelable: true });
    form!.dispatchEvent(event);

    expect(confirmSpy).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });
});

describe("ProfilePageClient helpers", () => {
  test("normalizes primitive values", () => {
    expect(asString("hello")).toBe("hello");
    expect(asString(123)).toBe("123");
    expect(asString(undefined, "fallback")).toBe("fallback");
  });

  test("derives user fields and avatar from alternate keys", () => {
    const user = {
      name: "Alt Name",
      email: 404,
      phone: 9800000000,
      bio: 77,
      profilePicture: "https://cdn.example.com/avatar.png"
    };

    expect(getUserDisplayName(user)).toBe("Alt Name");
    expect(getUserEmail(user)).toBe("404");
    expect(getUserPhone(user)).toBe("9800000000");
    expect(getUserBio(user)).toBe("77");
    expect(getAvatar(user)).toBe("https://cdn.example.com/avatar.png");
  });

  test("builds avatar URLs consistently", () => {
    expect(getAvatarUrl("")).toBe("");
    expect(getAvatarUrl("https://cdn.example.com/a.png")).toBe("https://cdn.example.com/a.png");
    expect(getAvatarUrl("C:\\temp\\uploads\\avatar.png")).toBe("http://127.0.0.1:5050/uploads/avatar.png");
    expect(getAvatarUrl("avatars/photo.png")).toBe("http://127.0.0.1:5050/avatars/photo.png");
  });

  test("submits profile updates through the action wrapper", async () => {
    const formData = new FormData();
    formData.set("fullName", "Jane");

    await expect(updateProfileAction({ success: false, message: "" }, formData)).resolves.toEqual({ success: true, message: "ok" });
    expect(mockedActions.handleUpdateProfile).toHaveBeenCalledWith(formData);
  });

  test("validates password action fields before submitting", async () => {
    const emptyForm = new FormData();
    await expect(changePasswordAction({ success: false, message: "" }, emptyForm)).resolves.toEqual({
      success: false,
      message: "All password fields are required."
    });

    const mismatchForm = new FormData();
    mismatchForm.set("currentPassword", "old");
    mismatchForm.set("newPassword", "new");
    mismatchForm.set("confirmPassword", "different");
    await expect(changePasswordAction({ success: false, message: "" }, mismatchForm)).resolves.toEqual({
      success: false,
      message: "New password and confirm password do not match."
    });
  });

  test("submits password changes and account deletion through action wrappers", async () => {
    const passwordForm = new FormData();
    passwordForm.set("currentPassword", "old");
    passwordForm.set("newPassword", "new");
    passwordForm.set("confirmPassword", "new");

    await expect(changePasswordAction({ success: false, message: "" }, passwordForm)).resolves.toEqual({ success: true, message: "ok" });
    expect(mockedActions.handleChangePassword).toHaveBeenCalledWith({
      currentPassword: "old",
      newPassword: "new"
    });

    await expect(deleteAccountAction()).resolves.toEqual({ success: true, message: "ok" });
    expect(mockedActions.handleDeleteAccount).toHaveBeenCalledWith({});
  });
});
