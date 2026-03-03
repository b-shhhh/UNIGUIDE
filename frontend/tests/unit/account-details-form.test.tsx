import { render, screen } from "@testing-library/react";
import AccountDetailsForm from "@/app/user/_components/AccountDetailsForm";

describe("AccountDetailsForm", () => {
  test("links to profile page", () => {
    render(<AccountDetailsForm />);
    const link = screen.getByRole("link", { name: /Open Account Details/i });
    expect(link).toHaveAttribute("href", "/user/profile");
  });
});
