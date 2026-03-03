import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SaveUniversityButton from "@/app/(private)/_component/SaveUniversityButton";

jest.mock("@/lib/saved-universities", () => ({
  fetchSavedUniversityIds: jest.fn(async () => []),
  toggleUniversitySaved: jest.fn(async (_id: string) => ({ ids: ["u-1"] })),
  SAVED_UNIVERSITIES_UPDATE_EVENT: "saved-update"
}));

const savedModule = require("@/lib/saved-universities");

describe("SaveUniversityButton", () => {
  test("toggles label after saving", async () => {
    render(<SaveUniversityButton universityId="u-1" />);

    expect(await screen.findByRole("button", { name: /Save University/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(savedModule.toggleUniversitySaved).toHaveBeenCalledWith("u-1");
      expect(screen.getByRole("button")).toHaveTextContent(/Unsave University/i);
    });
  });
});
