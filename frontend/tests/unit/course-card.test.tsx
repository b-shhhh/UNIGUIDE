import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CourseCard from "@/app/(private)/_component/CourseCard";

describe("CourseCard", () => {
  test("invokes onClick when provided", async () => {
    const onClick = jest.fn();
    render(<CourseCard name="Computer Science" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: /Computer Science/i }));
    expect(onClick).toHaveBeenCalled();
  });
});
