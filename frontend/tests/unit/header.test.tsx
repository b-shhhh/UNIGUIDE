import { render, screen } from "@testing-library/react";
import Header from "@/app/(private)/_component/Header";

describe("Header", () => {
  test("shows brand and key nav links", () => {
    render(<Header />);
    expect(screen.getByText(/UNIGUIDE/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Saved Unis/i })).toHaveAttribute("href", "/homepage/saved-universities");
    expect(screen.getByRole("link", { name: /Profile/i })).toHaveAttribute("href", "/user/profile");
  });
});
