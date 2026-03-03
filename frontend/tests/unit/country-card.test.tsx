import { render, screen } from "@testing-library/react";
import CountryCard from "@/app/(private)/_component/CountryCard";

describe("CountryCard", () => {
  test("shows initials when flag missing", () => {
    render(<CountryCard name="Nepal" count={5} />);
    expect(screen.getByText("NE")).toBeInTheDocument();
    expect(screen.getByText(/5 universities/i)).toBeInTheDocument();
  });

  test("renders flag image when provided", () => {
    render(<CountryCard name="Canada" flagUrl="https://flagcdn.com/ca.svg" />);
    const img = screen.getByAltText(/Canada flag/i) as HTMLImageElement;
    expect(img.src).toContain("flagcdn.com/ca.svg");
  });
});
