import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardChatbot from "@/app/(private)/_component/DashboardChatbot";

describe("DashboardChatbot", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({})
    } as Response);
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  test("opens and closes the chatbot panel", async () => {
    render(<DashboardChatbot />);
    await userEvent.click(screen.getByRole("button", { name: /Open chatbot/i }));
    expect(screen.getByText(/UniGuide Assistant/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Close chatbot/i }));
    expect(screen.queryByText(/UniGuide Assistant/i)).not.toBeInTheDocument();
  });

  test("shows fallback message when fetch fails", async () => {
    render(<DashboardChatbot />);
    await userEvent.click(screen.getByRole("button", { name: /Open chatbot/i }));
    await userEvent.type(screen.getByPlaceholderText(/Ask about country/i), "hello");
    await userEvent.click(screen.getByRole("button", { name: /Send/i }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });
});
