import { render, screen } from "@testing-library/react";
import Footer from "@/app/(private)/_component/Footer";

describe("Footer", () => {
  test("renders current year and tagline", () => {
    const year = new Date().getFullYear().toString();
    render(<Footer />);
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/Build your future/i)).toBeInTheDocument();
  });
});
