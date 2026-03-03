import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UniversityCard from "@/app/(private)/_component/UniversityCard";
import { useRouter } from "next/navigation";

jest.mock("@/app/(private)/_component/SaveUniversityButton", () => () => <div data-testid="save-button" />);

const baseUniversity = {
  id: "uni-1",
  name: "Test University",
  country: "Canada",
  courses: ["CS", "Math"],
  web_pages: "https://test.edu"
};

describe("UniversityCard", () => {
  test("navigates to detail page on click", async () => {
    render(<UniversityCard university={baseUniversity} />);
    await userEvent.click(screen.getByRole("button"));
    expect(useRouter().push).toHaveBeenCalledWith("/homepage/universities/uni-1");
  });

  test("falls back to generated logo when none provided", () => {
    render(<UniversityCard university={baseUniversity} />);
    const logo = screen.getByAltText(/Test University logo/i) as HTMLImageElement;
    expect(logo.src).toContain("logo.clearbit.com/test.edu");
  });
});
