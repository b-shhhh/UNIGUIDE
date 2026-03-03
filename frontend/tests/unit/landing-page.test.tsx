import { render, screen } from "@testing-library/react";
import LandingPage from "@/app/(public)/_component/LandingPage";

describe("LandingPage", () => {
  test("renders hero headline and CTAs", () => {
    render(<LandingPage />);
    expect(screen.getByText(/Top Countries/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign Up/i })).toBeInTheDocument();
  });
});
