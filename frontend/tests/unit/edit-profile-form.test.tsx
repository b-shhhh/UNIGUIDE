import { render, screen } from "@testing-library/react";
import EditProfileForm from "@/app/user/_components/EditProfileForm";

describe("EditProfileForm", () => {
  test("provides navigation to profile editor", () => {
    render(<EditProfileForm />);
    expect(screen.getByRole("link", { name: /Go to Profile Editor/i })).toHaveAttribute("href", "/user/profile");
  });
});
